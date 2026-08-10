import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { AuthenticationError } from "../types/errors";
import { PaginationDto } from "../dtos/user.dto.js";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      const error = new AuthenticationError("인증 정보가 유효하지 않습니다.");
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
  } catch (error) {
    next(error);
  }
};

const getMyLikes = async (
  req: Request<{}, {}, {}, PaginationDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.userId;
    if (!userId) {
      const error = new AuthenticationError("인증 정보가 유효하지 않습니다.");
      throw error;
    }
    const { page, pageSize, keyword } = req.query;

    const result = await userService.getMyLikes({
      userId,
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      keyword: keyword || "",
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getMe,
  getMyLikes,
};
