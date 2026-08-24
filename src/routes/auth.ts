import express from "express";
import authController from "../controllers/auth.controller";
import auth from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { signInSchema, signUpSchema } from "../schemas/user.schema";

const authRouter = express.Router();

authRouter.post("/signup", validate(signUpSchema), authController.signup);

authRouter.post("/signin", validate(signInSchema), authController.signin);

authRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  authController.refreshToken,
);

export default authRouter;
