import { success } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../schemas/article.schema.js";
import { idSchema } from "../schemas/common.schema.js";
import * as ArticleService from "../services/article.service.js";

export const getArticleList = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy, keyword } = req.query;
  const { articles, total, pageNum, take } = await ArticleService.findArticle(
    page,
    pageSize,
    orderBy,
    keyword,
  );

  res.json({
    success: true,
    page: pageNum,
    pageSize: take,
    totalCount: total,
    totalPages: Math.ceil(total / take),
    filters: { keyword, orderBy },
    list: articles,
  });
});

export const getArticleByID = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const article = await ArticleService.findArticleById(id);

  res.json({
    success: true,
    data: article,
  });
});

export const postArticle = asyncHandler(async (req, res) => {
  const validatedBody = await createArticleSchema.parse(req.body);
  const writerId = req.auth.userId;

  const article = await ArticleService.createArticle({
    title: validatedBody.title,
    content: validatedBody.content,
    writerId: writerId,
  });

  res.json({ success: true, data: article });
});

export const patchArticle = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = updateArticleSchema.parse(req.body);
  const article = await ArticleService.updateArticle(id, data);

  res.json({ success: true, data: article });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await ArticleService.deleteArticle(id);
  res.json({ success: true, message: "article이 삭제되었습니다" });
});
