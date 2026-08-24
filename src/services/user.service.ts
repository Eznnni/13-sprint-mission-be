import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma, User } from "@prisma/client";
import {
  AuthenticationError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/errors";
import userRepository from "../repositories/user.repository";
import productRepository from "../repositories/product.repository";

async function createUser(user: Pick<User, "email" | "nickname" | "password">) {
  try {
    const existedUser = await userRepository.findByEmail(user.email);
    if (existedUser) {
      const error = new ValidationError("이미 가입된 이메일입니다.", {
        email: user.email,
      });
      throw error;
    }

    const hashedPassword = await hashPassword(user.password);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    const customError = new ServerError(
      "데이터베이스 작업 중 오류가 발생했습니다.",
    );
    throw customError;
  }
}

function hashPassword(password: NonNullable<User["password"]>) {
  return bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function getUser(
  email: User["email"],
  password: NonNullable<User["password"]>,
) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new AuthenticationError("존재하지 않는 이메일입니다.");
      throw error;
    }
    await verifyPassword(password, user.password!);
    return filterSensitiveUserData(user);
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    const customError = new ServerError(
      "데이터베이스 작업 중 오류가 발생했습니다",
    );
    throw customError;
  }
}

async function getMe(userId: User["id"]) {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new NotFoundError("존재하지 않는 유저입니다.");
    throw error;
  }

  return filterSensitiveUserData(user);
}

async function verifyPassword(
  inputPassword: NonNullable<User["password"]>,
  password: NonNullable<User["password"]>,
) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    const error = new AuthenticationError("비밀번호가 일치하지 않습니다.");
    throw error;
  }
}

function createToken(
  user: Omit<User, "password" | "refreshToken">,
  type?: "access" | "refresh",
) {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

async function updateUser(
  id: User["id"],
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function refreshToken(
  userId: User["id"],
  refreshToken: NonNullable<User["refreshToken"]>,
) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new AuthenticationError("권한이 없습니다.");
    throw error;
  }

  const accessToken = createToken(user, "access");
  const newRefreshToken = createToken(user, "refresh");

  await updateUser(user.id, {
    refreshToken: newRefreshToken,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

interface GetMyLikesParams {
  userId: User["id"];
  page: number;
  pageSize: number;
  keyword?: string;
}

async function getMyLikes({
  userId,
  page,
  pageSize,
  keyword,
}: GetMyLikesParams) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const productWhereCondition: Prisma.ProductLikeWhereInput = {
    userId,
  };

  if (keyword) {
    productWhereCondition.product = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };
  }

  const [likes, totalCount] = await productRepository.findLikes({
    where: productWhereCondition,
    skip,
    take,
  });

  const list = likes.map((like) => {
    const product = like.product;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.image ?? [],
      tags: product.tags.map((tag) => tag.name),
      ownerId: product.writer.id,
      ownerNickname: product.writer.nickname,
      likeCount: product.likeCount,
      createdAt: like.createdAt,
    };
  });

  return { totalCount, list };
}

export default {
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
  getMe,
  getMyLikes,
};
