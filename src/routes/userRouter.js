import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signInSchema, signUpSchema } from "../schemas/user.schema.js";

const userRouter = express.Router();

userRouter.post("/signup", validate(signUpSchema), async (req, res, next) => {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;

    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/signin", validate(signInSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { userId } = req.auth;

      const { accessToken, refreshToken: newRefreshToken } =
        await userService.refreshToken(userId, refreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });
      return res.json({ accessToken });
    } catch (error) {
      return next(error);
    }
  },
);

export default userRouter;
