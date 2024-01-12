import express from "express";
import userRouter from "./userRouter.js";
import emailRouter from "./emailRouter.js";
import gdlRouter from "./gdlRouter.js";
import cors from "cors";

const apiRouter = express.Router();

apiRouter.use(cors());

apiRouter.use(express.json());

apiRouter.use("/users", userRouter);
apiRouter.use("/verifyEmail", emailRouter);
apiRouter.use("/gdl", gdlRouter);

export default apiRouter;
