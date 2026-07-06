import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/", auth.isLoggedIn, async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    const error = new Error("인증 정보가 유효하지 않습니다.");
    error.code = 401;
    throw error;
  }

  const user = await userService.getMe(userId);

  res.status(200).json({
    id: user.id,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

userRouter.get("/likes", auth.isLoggedIn, async (req, res) => {
  const userId = req.auth.userId;
  const { page, pageSize, keyword } = req.query;

  const result = await userService.getMyLikes({
    userId,
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10,
    keyword: keyword || "",
  });
  res.status(200).json(result);
});

export default userRouter;
