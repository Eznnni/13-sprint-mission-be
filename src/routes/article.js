import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import * as CommentController from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", ArticleController.getArticleList);

router.get("/:id", ArticleController.getArticleByID);

router.post("/", ArticleController.postArticle);

router.patch("/:id", ArticleController.patchArticle);

router.delete("/:id", ArticleController.deleteArticle);

//Comment Route
router.get("/:id/comments", CommentController.getArticleCommentList);

router.post("/:id/comments", CommentController.postArticleComment);

export default router;
