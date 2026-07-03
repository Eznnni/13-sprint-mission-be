import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, nickname, password, passwordConfirm } = req.body;
    if (!email || !nickname || !password || !passwordConfirm) {
      const error = new Error(
        "이메일, 닉네임, 비밀번호, 비밀번호 확인 모두 필요합니다.",
      );
      error.code = 400;
      throw error;
    }

    if (password !== passwordConfirm) {
      const error = new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      error.code = 400;
      throw error;
    }

    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
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
