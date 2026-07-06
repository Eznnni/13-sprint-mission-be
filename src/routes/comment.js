import express from "express";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: 통합 댓글 수정 및 삭제 API
 */

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: 댓글 내용 수정
 *     description: 작성자가 자신이 작성한 댓글(상품 혹은 게시글)의 내용을 수정합니다.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
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
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     content:
 *                       type: string
 *                       example: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T07:07:13.399Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:52:59.570Z"
 *                     articleId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     productId:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                     writerId:
 *                       type: integer
 *                       example: 3
 */
router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isCommentOwner,
  CommentController.patchComment,
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 댓글을 영구히 삭제합니다. 작성자만 가능합니다.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: comment가 삭제되었습니다
 */
router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isCommentOwner,
  CommentController.deleteComment,
);

export default router;
