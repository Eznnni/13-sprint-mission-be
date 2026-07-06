import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", ArticleController.getArticleList);

router.get("/:id", auth.isLoggedIn, ArticleController.getArticleByID);

router.post("/", auth.isLoggedIn, ArticleController.postArticle);

router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.patchArticle,
);

router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.deleteArticle,
);

//Comment Route
router.get("/:id/comments", CommentController.getArticleCommentList);

router.post(
  "/:id/comments",
  auth.isLoggedIn,
  CommentController.postArticleComment,
);

//Like Route
router.post("/:id/like", auth.isLoggedIn, ArticleController.postArticleLike);

router.delete(
  "/:id/like",
  auth.isLoggedIn,
  ArticleController.deleteArticleLike,
);
export default router;
