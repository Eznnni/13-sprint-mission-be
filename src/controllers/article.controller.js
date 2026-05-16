import { success } from "zod";
import { ORDERBY } from "../constants/common.js";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../schemas/article.schema.js";
import { idSchema } from "../schemas/common.schema.js";

export const getArticleList = asyncHandler(async (req, res) => {
  const { page = "1", limit = "10", sort = "recent", search } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };

  const pageNum = parseInt(page) || 1;
  const take = parseInt(limit) || 10;
  const skip = (pageNum - 1) * take;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy, skip, take }),
    prisma.article.count({ where }),
  ]);

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    filters: { search, sort },
    data: articles,
  });
});

export const getArticleByID = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const article = await prisma.article.findUnique({
    where: { id },
  });
  res.json({
    success: true,
    data: article,
  });
});

export const postArticle = asyncHandler(async (req, res) => {
  const { title, content } = createArticleSchema.parse(req.body);
  const article = await prisma.article.create({
    data: { title: title, content: content },
  });
  res.json({ success: true, data: article });
});

export const patchArticle = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = updateArticleSchema.parse(req.body);
  const article = await prisma.article.update({
    where: { id },
    data,
  });
  res.json({ success: true, data: article });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await prisma.article.delete({ where: { id } });
  res.json({ success: true, message: "article이 삭제되었습니다" });
});
