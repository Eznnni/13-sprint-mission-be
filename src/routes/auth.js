import express from "express";
import authController from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signInSchema, signUpSchema } from "../schemas/user.schema.js";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 회원가입, 로그인 및 토큰 인증 관리 API
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 이메일, 닉네임, 비밀번호를 입력받아 새로운 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               passwordConfirmation:
 *                 type: string
 *                 description: 비밀번호 확인
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 refreshToken:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 5
 *               email: string@ex.com
 *               nickname: string
 *               image: null
 *               refreshToken: null
 *               createdAt: "2026-07-06T13:55:32.294Z"
 *               updatedAt: "2026-07-06T13:55:32.294Z"
 *       404:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: string
 */
authRouter.post("/signup", validate(signUpSchema), authController.signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호로 로그인하여 AccessToken과 쿠키 기반 RefreshToken을 발급받습니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공 및 AccessToken 반환 (RefreshToken은 HttpOnly Cookie에 저장)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 refreshToken:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 accessToken:
 *                   type: string
 *             example:
 *               id: 5
 *               email: string@ex.com
 *               nickname: string
 *               image: null
 *               refreshToken: null
 *               createdAt: "2026-07-06T13:55:32.294Z"
 *               updatedAt: "2026-07-06T13:55:32.294Z"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: string
 */
authRouter.post("/signin", validate(signInSchema), authController.signin);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: 토큰 갱신 (Refresh Token)
 *     description: 쿠키의 Refresh Token을 검증하여 새로운 Access Token과 Refresh Token을 발급합니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access Token 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       404:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: string
 */
authRouter.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  authController.refreshToken,
);

export default authRouter;
