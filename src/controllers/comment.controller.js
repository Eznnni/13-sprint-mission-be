import { success } from "zod";
import { ORDERBY } from "../constants/common.js";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createCommentSchema from "../schemas/comment.schema.js";
import { idSchema } from "../schemas/common.schema.js";
import { cursorPagination } from "../utils/pagination.js";
import * as CommentService from "../services/comment.service.js";

export const getProductCommentList = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { limit, sort, lastId } = req.query;
  const { comments, total, queryOptions, nextCursor } =
    await CommentService.findProductCommentList(id, limit, sort, lastId);

  res.json({
    success: true,
    limit: queryOptions.take,
    total,
    nextCursor,
    sort: sort,
    data: comments,
  });
});

export const postProductComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { content } = createCommentSchema.parse(req.body);
  const comment = await CommentService.createProductComment(content, id);

  res.json({ success: true, data: comment });
});

export const getArticleCommentList = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { limit, sort, lastId } = req.query;
  const { comments, total, queryOptions, nextCursor } =
    await CommentService.findArticleCommentList(id, limit, sort, lastId);

  res.json({
    success: true,
    limit: queryOptions.take,
    total,
    nextCursor,
    sort: sort,
    data: comments,
  });
});

export const postArticleComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { content } = createCommentSchema.parse(req.body);
  const comment = await CommentService.createArticleComment(content, id);

  res.json({ success: true, data: comment });
});

export const patchComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = createCommentSchema.parse(req.body);
  const comment = await CommentService.updateComment(id, data);

  res.json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await CommentService.deleteComment(id);

  res.json({ success: true, message: "comment가 삭제되었습니다" });
});
