import express from "express";
import { User } from "./models/users.js";
import { Event } from "./models/events.js";
import { genericError } from "./middlewares/genericError.js";
import bcrypt from "bcrypt";
import cloudinaryUploader from "./configuration/confUser.js";
import { v2 as cloudinary } from "cloudinary";
import checkJwt from "./middlewares/jwt.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const userRouter = express.Router();

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

userRouter.get(
  "/google-callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  async (req, res) => {
    const payload = { id: req.user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(
      `https://gdlove.netlify.app/?token=${token}&userId=${req.user.id}`
    );
  }
);

userRouter.get("/", async (req, res, next) => {
  //ritorna tutti gli utenti
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  //ritorna un utente specifico autenticato
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payload.id)
      .select("-password")
      .populate("eventId gdlId");
    res.json(req.user);
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  //aggiunge un utente specifico con password criptata
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = await User.create({
      ...req.body,
      password,
    });

    const { password: _, __v, ...newUserWithoutPassword } = newUser.toObject();

    res.status(201).json(newUserWithoutPassword);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Authentication - Autenticazione
// il processo di verifica dell'identità di un utente
userRouter.post("/session", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ userId: user._id, token });
});

userRouter.delete("/session", async (req, res) => {});
// Logout

userRouter.post("/checkUserExistence", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("User Email:", email);

    // Cerca l'utente nel database usando il campo email
    const existingUser = await User.findOne({ email: email });
    console.log("Existing User:", existingUser);

    // Invia la risposta al client indicando se l'utente esiste o meno
    res.json({ userExists: !!existingUser });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.put("/:id", async (req, res, next) => {
  //modifica un utente specifico
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  //cancella un utente specifico
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

cloudinary.config({
  URL: process.env.CLOUDINARY_URL,
});

userRouter.patch("/:id/avatar", cloudinaryUploader, async (req, res, next) => {
  //aggiunge l'avatar di un utente specifico
  try {
    console.log(req.file);
    let updatedAvatar = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.path },
      { new: true }
    );
    res.send(updatedAvatar);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
