import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";
import list from "express-list-endpoints";
import cors from "cors";
import googleStrategy from "./middlewares/google.js";
import { genericError } from "./middlewares/genericError.js";
import passport from "passport";
import path from "path";

const server = express();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3330",
  "http://localhost:3330/carica-modello",
  "https://accounts.google.com/o/oauth2/auth",
  "https://capstone-project-gdl-backend.onrender.com",
  "https://capstone-project-gdl-backend.onrender.com/api/users",
  "https://capstone-project-gdl-backend.onrender.com/api/users/google",
  "https://capstone-project-gdl-backend.onrender.com/api/users/google-callback",
  "https://gdlove.netlify.app",
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

server.get("/carica-modello", (req, res) => {
  res.header("Content-Type", "model/gltf-binary");
  const filePath = path.resolve("./public/libroRosso.glb");
  res.sendFile(filePath);
});

server.get("/carica-modello2", (req, res) => {
  res.header("Content-Type", "model/gltf-binary");
  const filePath = path.resolve("./public/solo-libreria.glb");
  res.sendFile(filePath);
});

server.get("/carica-modello3", (req, res) => {
  res.header("Content-Type", "model/gltf-binary");
  const filePath = path.resolve("./public/solo-libri-colorati.glb");
  res.sendFile(filePath);
});
