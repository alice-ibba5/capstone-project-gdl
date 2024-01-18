import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";
import list from "express-list-endpoints";
import cors from "cors";
import googleStrategy from "./middlewares/google.js";
import { genericError } from "./middlewares/genericError.js";
import passport from "passport";

const server = express();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3330",
  "https://accounts.google.com/o/oauth2/auth",
  "https://capstone-project-gdl-backend.onrender.com/api/users/google",
  "https://capstone-project-gdl-backend.onrender.com/api/users/google-callback",
  "https://gdlove.netlify.app/",
];
const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.includes(origin) || !origin) {
      next(null, true);
    } else {
      next(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));

server.use(express.json());

const port = 3330;

server.use("/api", apiRouter);

server.use(genericError);

passport.use(googleStrategy);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("Server listening on port: " + port);
      console.log(list(server));
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });
