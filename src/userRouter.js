import express from "express";
import { User } from "./models/users.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  //ritorna tutti gli autori
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
