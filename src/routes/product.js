import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import * as CommentController from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", ProductController.getProductList);

router.get("/:id", ProductController.getProductBYId);

router.post("/", ProductController.postProduct);

router.patch("/:id", ProductController.patchProduct);

router.put("/:id", ProductController.upsertProduct);

router.delete("/:id", ProductController.deleteProduct);

//Comment Route
router.get("/:id/comments", CommentController.getProductCommentList);

router.post("/:id/comments", CommentController.postProductComment);

export default router;
