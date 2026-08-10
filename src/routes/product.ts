import express from "express";
import auth from "../middlewares/auth";
import { uploadImages } from "../middlewares/imageUpload";
import ProductController from "../controllers/product.controller";

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

router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isProductOwner,
  ProductController.deleteProduct,
);

// router.get("/:id/comments", CommentController.getProductCommentList);

// router.post(
//   "/:id/comments",
//   auth.isLoggedIn,
//   CommentController.postProductComment,
// );

router.post("/:id/like", auth.isLoggedIn, ProductController.postProductLike);

router.delete(
  "/:id/like",
  auth.isLoggedIn,
  ProductController.deleteProductLike,
);

export default router;
