import express from "express";

const server = express();

const port = 3330;

server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
