import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: 내 정보 관리 및 좋아요 리스트 API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 프로필 정보 조회
 *     description: 현재 로그인한 사용자의 고유 정보(ID, 닉네임, 프로필 이미지 등)를 조회합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 nickname:
 *                   type: string
 *                   example: 오리
 *                 image:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-03T14:41:26.114Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-06T09:47:01.421Z"
 *       401:
 *         description: 인증 정보가 유효하지 않음 (토큰 누락 또는 만료)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: jwt expired
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

/**
 * @swagger
 * /users/me/likes:
 *   get:
 *     summary: 내가 좋아요(찜) 한 상품 목록 조회
 *     description: 로그인한 유저가 하트(좋아요)를 누른 상품 리스트를 조건 필터링 및 페이지네이션하여 노출합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 한 페이지에 띄울 상품 개수
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 상품명 또는 설명 타겟 검색어
 *     responses:
 *       200:
 *         description: 내 찜 목록 바구니 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 1
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 9
 *                       name:
 *                         type: string
 *                         example: 맥북 에어 M2
 *                       description:
 *                         type: string
 *                         example: 미개봉 새상품 맥북 에어 팝니다.
 *                       price:
 *                         type: integer
 *                         example: 1200000
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       ownerId:
 *                         type: integer
 *                         example: 1
 *                       ownerNickname:
 *                         type: string
 *                         example: 김은진
 *                       likeCount:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-06T06:49:41.631Z"
 *       401:
 *         description: 인증 정보가 유효하지 않음 (토큰 누락 또는 만료)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: jwt expired
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
