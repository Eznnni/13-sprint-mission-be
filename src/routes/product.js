import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";
import { uploadImages } from "../middlewares/imageUpload.js";

const router = express.Router();

router.get("/", ProductController.getProductList);

router.get("/:id", auth.isLoggedIn, ProductController.getProductBYId);

router.post("/", auth.isLoggedIn, uploadImages, ProductController.postProduct);

router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isProductOwner,
  uploadImages,
  ProductController.patchProduct,
);

router.put(
  "/:id",
  auth.isLoggedIn,
  auth.isProductOwner,
  ProductController.upsertProduct,
);

router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isProductOwner,
  ProductController.deleteProduct,
);

//Comment Route
router.get("/:id/comments", CommentController.getProductCommentList);

router.post(
  "/:id/comments",
  auth.isLoggedIn,
  CommentController.postProductComment,
);

//Like Route
router.post("/:id/like", auth.isLoggedIn, ProductController.postProductLike);

router.delete(
  "/:id/like",
  auth.isLoggedIn,
  ProductController.deleteProductLike,
);

export default router;
