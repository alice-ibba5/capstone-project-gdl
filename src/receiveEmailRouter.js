import express from "express";
import { Email } from "./models/email.js";

const receiveEmailRouter = express.Router();

receiveEmailRouter.get("/", async (req, res, next) => {
  //ritorna tutte le email
  try {
    const email = await Email.find({}).populate("user");
    res.json(email);
  } catch (error) {
    next(error);
  }
});

receiveEmailRouter.post("/", async (req, res, next) => {
  //aggiunge una nuova email
  try {
    const newEmail = new Email(req.body);

    await newEmail.save();

    res.status(201).json(newGdl);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

export default receiveEmailRouter;
