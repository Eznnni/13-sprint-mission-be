import express from "express";
import userService from "../services/userService.js";

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

export default userRouter;
