import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { CreateUserDto, SigninUserDto } from "../dtos/user.dto";
import { ValidationError } from "../types/errors";
import { User } from "../generated/prisma";

const signup = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;

    if (!email || !nickname || !password) {
      const error = new ValidationError(
        "email, name, password 가 모두 필요합니다.",
      );
      throw error;
    }

    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const signin = async (
  req: Request<{}, {}, SigninUserDto>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new ValidationError("email, password 가 모두 필요합니다.");
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
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth!;

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
};

export default {
  signup,
  signin,
  refreshToken,
};
