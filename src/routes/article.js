import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Articles
 *     description: 커뮤니티 게시글 관리 및 조회 API
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     description: 페이지네이션, 정렬, 검색어를 포함하여 커뮤니티 게시글 목록을 조회합니다.
 *     tags: [Articles]
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
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: recent
 *         description: 정렬 기준 (recent, likeCount)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드 (제목 및 내용 검색)
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalCount:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                   nullable: true
 *                 filters:
 *                   type: object
 *                   properties:
 *                     orderBy:
 *                       type: string
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                       likeCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       writer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nickname:
 *                             type: string
 *                           image:
 *                             type: string
 *                             nullable: true
 *             example:
 *               success: true
 *               totalCount: 8
 *               totalPages: null
 *               filters:
 *                 orderBy: recent
 *               list:
 *                 - id: 1
 *                   title: string
 *                   content: string
 *                   image: []
 *                   likeCount: 0
 *                   createdAt: "2026-07-06T00:00:00.000Z"
 *                   updatedAt: "2026-07-06T00:00:00.000Z"
 *                   writer:
 *                     id: 1
 *                     nickname: string
 *                     image: null
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
router.get("/", ArticleController.getArticleList);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: 게시글 상세 조회
 *     description: 특정 ID의 게시글 상세 정보와 좋아요 상태를 조회합니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likeCount:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     isLiked:
 *                       type: boolean
 *                     writer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nickname:
 *                           type: string
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 title: string
 *                 content: string
 *                 images: []
 *                 likeCount: 0
 *                 createdAt: "2026-07-06T00:00:00.000Z"
 *                 updatedAt: "2026-07-06T00:00:00.000Z"
 *                 isLiked: false
 *                 writer:
 *                   id: 1
 *                   nickname: string
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
router.get("/:id", auth.isLoggedIn, ArticleController.getArticleByID);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: 게시글 등록
 *     description: 새로운 커뮤니티 게시글을 등록합니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likeCount:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     writerId:
 *                       type: integer
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 title: string
 *                 content: string
 *                 image: []
 *                 likeCount: 0
 *                 createdAt: "2026-07-06T00:00:00.000Z"
 *                 updatedAt: "2026-07-06T00:00:00.000Z"
 *                 writerId: 1
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
router.post("/", auth.isLoggedIn, ArticleController.postArticle);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: 게시글 수정
 *     description: 등록된 게시글의 제목이나 내용을 수정합니다. 작성자만 가능합니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     likeCount:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     writerId:
 *                       type: integer
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 title: string
 *                 content: string
 *                 image: []
 *                 likeCount: 0
 *                 createdAt: "2026-07-06T00:00:00.000Z"
 *                 updatedAt: "2026-07-06T00:00:00.000Z"
 *                 writerId: 1
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
router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.patchArticle,
);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     description: 특정 게시글을 삭제합니다. 작성자만 가능합니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: article이 삭제되었습니다
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
router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.deleteArticle,
);

/**
 * @swagger
 * /articles/{id}/comments:
 *   get:
 *     summary: 게시글 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 nextCursor:
 *                   type: integer
 *                   nullable: true
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       writer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nickname:
 *                             type: string
 *                           image:
 *                             type: string
 *                             nullable: true
 *             example:
 *               success: true
 *               limit: 3
 *               total: 3
 *               nextCursor: 7
 *               list:
 *                 - id: 1
 *                   content: string
 *                   createdAt: "2026-07-06T00:00:00.000Z"
 *                   updatedAt: "2026-07-06T00:00:00.000Z"
 *                   writer:
 *                     id: 1
 *                     nickname: string
 *                     image: null
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
router.get("/:id/comments", CommentController.getArticleCommentList);

/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     summary: 게시글 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     articleId:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *                       nullable: true
 *                     writerId:
 *                       type: integer
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 content: string
 *                 createdAt: "2026-07-06T00:00:00.000Z"
 *                 updatedAt: "2026-07-06T00:00:00.000Z"
 *                 articleId: 1
 *                 productId: null
 *                 writerId: 1
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
router.post(
  "/:id/comments",
  auth.isLoggedIn,
  CommentController.postArticleComment,
);

/**
 * @swagger
 * /articles/{id}/like:
 *   post:
 *     summary: 게시글 좋아요 등록
 *     description: 특정 게시글에 좋아요를 등록하고 좋아요 수를 증가시킵니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 likeCount:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 isLiked:
 *                   type: boolean
 *                 writer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nickname:
 *                       type: string
 *             example:
 *               id: 1
 *               title: string
 *               content: string
 *               images: []
 *               likeCount: 1
 *               createdAt: "2026-07-06T00:00:00.000Z"
 *               updatedAt: "2026-07-06T00:00:00.000Z"
 *               isLiked: true
 *               writer:
 *                 id: 1
 *                 nickname: string
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
router.post("/:id/like", auth.isLoggedIn, ArticleController.postArticleLike);

/**
 * @swagger
 * /articles/{id}/like:
 *   delete:
 *     summary: 게시글 좋아요 취소
 *     description: 특정 게시글의 좋아요를 취소하고 좋아요 수를 감소시킵니다.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 likeCount:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 isLiked:
 *                   type: boolean
 *                 writer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nickname:
 *                       type: string
 *             example:
 *               id: 1
 *               title: string
 *               content: string
 *               images: []
 *               likeCount: 0
 *               createdAt: "2026-07-06T00:00:00.000Z"
 *               updatedAt: "2026-07-06T00:00:00.000Z"
 *               isLiked: false
 *               writer:
 *                 id: 1
 *                 nickname: string
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
router.delete(
  "/:id/like",
  auth.isLoggedIn,
  ArticleController.deleteArticleLike,
);

export default router;
