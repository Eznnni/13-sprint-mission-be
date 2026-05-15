import express from "express";
import * as ArticleController from "../controllers/article.controller.js";

const router = express.Router();

router.get("/", ArticleController.getArticleList);

router.get("/:id", ArticleController.getArticleByID);

router.post("/", ArticleController.postArticle);

router.patch("/:id", ArticleController.patchArticle);

router.delete("/:id", ArticleController.deleteArticle);

export default router;
