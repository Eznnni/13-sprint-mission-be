import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";
import { uploadImages } from "../middlewares/imageUpload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: 중고 상품 관리 및 조회 API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     description: 페이지네이션, 정렬, 검색어를 포함하여 상품 목록을 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "recent"
 *         description: 정렬 기준 (예 - recent, favorite)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 filters:
 *                   type: object
 *                   example: { "search": "맥북" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 11
 *                       name:
 *                         type: string
 *                         example: 비타민D
 *                       description:
 *                         type: string
 *                         example: 몸에 좋은 비타민D 입니다!
 *                       price:
 *                         type: integer
 *                         example: 100000
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                       likeCount:
 *                         type: integer
 *                         example: 0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-06T13:30:54.308Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-06T13:30:54.308Z"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["식품", "영양제"]
 *                       writer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           nickname:
 *                             type: string
 *                             example: 오리
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: null
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
router.get("/", ProductController.getProductList);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     description: 특정 ID의 상품 상세 정보, 좋아요 여부, 댓글 리스트를 조회합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 상세 조회 성공
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
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: 맥북 에어 M2
 *                     description:
 *                       type: string
 *                       example: 미개봉 새상품 맥북 에어 팝니다.
 *                     price:
 *                       type: integer
 *                       example: 1200000
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     ownerId:
 *                       type: integer
 *                       example: 1
 *                     ownerNickname:
 *                       type: string
 *                       example: 김은진
 *                     likeCount:
 *                       type: integer
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T06:07:44.539Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T06:07:44.539Z"
 *                     isLiked:
 *                       type: boolean
 *                       example: false
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: []
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
router.get("/:id", auth.isLoggedIn, ProductController.getProductBYId);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록 (이미지 포함)
 *     description: 새로운 중고 상품을 등록합니다. (이미지는 최대 3개)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품 이름
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *               price:
 *                 type: integer
 *                 description: 상품 가격
 *               tags:
 *                 type: string
 *                 description: 태그 배열 (JSON 문자열 형태, 예 - '["전자제품", "노트북"]')
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 상품 이미지 파일들 (JPG, PNG 등)
 *     responses:
 *       200:
 *         description: 상품 등록 성공
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
 *                       example: 11
 *                     name:
 *                       type: string
 *                       example: 비타민D
 *                     description:
 *                       type: string
 *                       example: 몸에 좋은 비타민D 입니다!
 *                     price:
 *                       type: integer
 *                       example: 100000
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     likeCount:
 *                       type: integer
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:30:54.308Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:30:54.308Z"
 *                     writerId:
 *                       type: integer
 *                       example: 3
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: 식품
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
router.post("/", auth.isLoggedIn, uploadImages, ProductController.postProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 정보 및 이미지 부분 수정
 *     description: 등록된 상품의 정보나 이미지를 수정합니다. 작성자만 가능합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: 상품 수정 성공
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
 *                       example: 11
 *                     name:
 *                       type: string
 *                       example: 테슬라 자동차
 *                     description:
 *                       type: string
 *                       example: 몸에 좋은 비타민D 입니다!
 *                     price:
 *                       type: integer
 *                       example: 100000
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     likeCount:
 *                       type: integer
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:30:54.308Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:37:23.997Z"
 *                     writerId:
 *                       type: integer
 *                       example: 3
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: 식품
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
  auth.isProductOwner,
  uploadImages,
  ProductController.patchProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: 상품 덮어쓰기 (Upsert)
 *     description: 상품 데이터를 통째로 덮어쓰거나 생성합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 상품 Upsert 성공
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
router.put(
  "/:id",
  auth.isLoggedIn,
  auth.isProductOwner,
  ProductController.upsertProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     description: 특정 상품을 삭제합니다. 작성자만 가능합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
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
 *                   example: Product가 삭제되었습니다
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
  auth.isProductOwner,
  ProductController.deleteProduct,
);

/**
 * @swagger
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
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
 *                   example: true
 *                 limit:
 *                   type: integer
 *                   example: 3
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 nextCursor:
 *                   type: integer
 *                   nullable: true
 *                   example: 6
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 6
 *                       content:
 *                         type: string
 *                         example: 댓글 달기
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-06T13:46:25.637Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-06T13:46:25.637Z"
 *                       writer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           nickname:
 *                             type: string
 *                             example: 오리
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: null
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
router.get("/:id/comments", CommentController.getProductCommentList);

/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: 상품 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 6
 *                     content:
 *                       type: string
 *                       example: 댓글 달기
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:46:25.637Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-06T13:46:25.637Z"
 *                     articleId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     productId:
 *                       type: integer
 *                       nullable: true
 *                       example: 10
 *                     writerId:
 *                       type: integer
 *                       example: 3
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
  CommentController.postProductComment,
);

/**
 * @swagger
 * /products/{id}/like:
 *   post:
 *     summary: 상품 좋아요 등록
 *     description: 특정 상품에 좋아요(하트)를 등록합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
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
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: 맥북 에어 M2
 *                 description:
 *                   type: string
 *                   example: 미개봉 새상품 맥북 에어 팝니다.
 *                 price:
 *                   type: integer
 *                   example: 1200000
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 ownerId:
 *                   type: integer
 *                   example: 1
 *                 ownerNickname:
 *                   type: string
 *                   example: 김은진
 *                 likeCount:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-06T06:07:44.539Z"
 *                 isLiked:
 *                   type: boolean
 *                   example: true
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
router.post("/:id/like", auth.isLoggedIn, ProductController.postProductLike);

/**
 * @swagger
 * /products/{id}/like:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     description: 특정 상품의 좋아요(하트)를 취소합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
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
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: 맥북 에어 M2
 *                 description:
 *                   type: string
 *                   example: 미개봉 새상품 맥북 에어 팝니다.
 *                 price:
 *                   type: integer
 *                   example: 1200000
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 ownerId:
 *                   type: integer
 *                   example: 1
 *                 ownerNickname:
 *                   type: string
 *                   example: 김은진
 *                 likeCount:
 *                   type: integer
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-06T06:07:44.539Z"
 *                 isLiked:
 *                   type: boolean
 *                   example: false
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
  ProductController.deleteProductLike,
);

export default router;
