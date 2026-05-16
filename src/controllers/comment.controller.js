import { success } from "zod";
import { ORDERBY } from "../constants/common.js";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createCommentSchema from "../schemas/comment.schema.js";
import { idSchema } from "../schemas/common.schema.js";

export const getProductCommentList = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { limit = "3", sort = "recent", lastId } = req.query;

  const take = parseInt(limit) || 3;
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { productId: id };

  let queryOptions = {
    where,
    take,
    orderBy,
  };

  if (lastId) {
    queryOptions.skip = 1;
    queryOptions.cursor = { id: parseInt(lastId) };
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany(queryOptions),
    prisma.comment.count({ where }),
  ]);

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;

  res.json({
    success: true,
    limit: take,
    total,
    nextCursor,
    sort: sort,
    data: comments,
  });
});

export const postProductComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { content } = createCommentSchema.parse(req.body);

  const comment = await prisma.comment.create({
    data: { content: content, productId: id },
  });
  res.json({ success: true, data: comment });
});

export const getArticleCommentList = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { limit = "3", sort = "recent", lastId } = req.query;

  const take = parseInt(limit) || 3;
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { articleId: id };

  let queryOptions = {
    where,
    take,
    orderBy,
  };

  if (lastId) {
    queryOptions.skip = 1;
    queryOptions.cursor = { id: parseInt(lastId) };
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany(queryOptions),
    prisma.comment.count({ where }),
  ]);

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;

  res.json({
    success: true,
    limit: take,
    total,
    nextCursor,
    sort: sort,
    data: comments,
  });
});

export const postArticleComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { content } = createCommentSchema.parse(req.body);

  const comment = await prisma.comment.create({
    data: { content: content, articleId: id },
  });
  res.json({ success: true, data: comment });
});

export const patchComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = createCommentSchema.parse(req.body);
  const comment = await prisma.comment.update({
    where: { id: id },
    data,
  });
  res.json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await prisma.comment.delete({ where: { id: id } });
  res.json({ success: true, message: "comment가 삭제되었습니다" });
});
