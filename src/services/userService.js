import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.email);
  if (existedUser) {
    const error = new Error("이미 가입된 이메일입니다.");
    error.code = 409;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });

  return filterSensitiveUserData(createdUser);
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user) {
  const { password, ...rest } = user;
  return rest;
}

async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("존재하지 않는 이메일입니다.");
    error.code = 401;
    throw error;
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function getMe(userId) {
  const user = await userRepository.findById(parseInt(userId, 10));

  if (!user) {
    const error = new Error("존재하지 않는 유저입니다.");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword, password) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

function createToken(user, type = "access") {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

async function updateUser(id, data) {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  //맞는 유저가 없거나, refreshToken이 만료된 경우
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("권한이 없습니다.");
    error.code = 401;
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

async function getMyLikes({ userId, page, pageSize, keyword }) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const productWhereCondition = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const [likes, totalCount] = await Promise.all([
    prisma.productLike.findMany({
      where: {
        userId: parseInt(userId, 10),
        product: productWhereCondition,
      },
      skip,
      take,
      include: {
        product: {
          include: { writer: true, tags: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productLike.count({
      where: {
        userId: parseInt(userId, 10),
        product: productWhereCondition,
      },
    }),
  ]);

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
