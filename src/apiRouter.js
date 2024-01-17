import express from "express";
import userRouter from "./userRouter.js";
import emailRouter from "./emailRouter.js";
import gdlRouter from "./gdlRouter.js";
import emailContattiRouter from "./emailContattiRouter.js";
import receiveEmailRouter from "./receiveEmailRouter.js";
import cors from "cors";

const apiRouter = express.Router();

apiRouter.use(cors());

apiRouter.use(express.json());

apiRouter.use("/users", userRouter);
apiRouter.use("/verifyEmail", emailRouter);
apiRouter.use("/contattiEmail", emailContattiRouter);
apiRouter.use("/gdl", gdlRouter);
apiRouter.use("/receiveEmail", receiveEmailRouter);

export default apiRouter;
