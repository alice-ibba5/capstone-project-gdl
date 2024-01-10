import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";
import list from "express-list-endpoints";
import cors from "cors";

const server = express();

const whitelist = ["http://localhost:3000", "http://localhost:3330"];
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
