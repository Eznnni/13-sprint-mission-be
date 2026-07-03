import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

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

export default {
  createUser,
};
