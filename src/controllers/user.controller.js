import userService from "../services/user.service.js";

const getMe = async (req, res) => {
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
};

const getMyLikes = async (req, res) => {
  const userId = req.auth.userId;
  const { page, pageSize, keyword } = req.query;

  const result = await userService.getMyLikes({
    userId,
    page: parseInt(page, 10) || 1,
    pageSize: parseInt(pageSize, 10) || 10,
    keyword: keyword || "",
  });
  res.status(200).json(result);
};

export default {
  getMe,
  getMyLikes,
};
