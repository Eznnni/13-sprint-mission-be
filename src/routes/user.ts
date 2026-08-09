import express from "express";
import auth from "../middlewares/auth";
import userController from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", auth.isLoggedIn, userController.getMe);

userRouter.get("/likes", auth.isLoggedIn, userController.getMyLikes);

export default userRouter;
