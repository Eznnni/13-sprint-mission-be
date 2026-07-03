import { ORDERBY } from "../constants/common.js";
import prisma from "../lib/prisma.js";
import { cursorPagination } from "../utils/pagination.js";

export const findProductCommentList = async (id, limit, sort, lastId) => {
  const queryOptions = cursorPagination(limit, lastId);
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { productId: id };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      ...queryOptions,
      where,
      orderBy,
      include: {
        writer: true,
      },
    }),
    prisma.comment.count({ where }),
  ]);

  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    writer: {
      id: comment.writer.id,
      nickname: comment.writer.nickname,
      image: comment.writer.image,
    },
  }));

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;

  return { comments: formattedComments, total, queryOptions, nextCursor };
};

export const createProductComment = async (content, id, writerId) => {
  const comment = await prisma.comment.create({
    data: { content: content, productId: id, writerId: writerId },
  });
  return comment;
};

export const findArticleCommentList = async (id, limit, sort, lastId) => {
  const queryOptions = cursorPagination(limit, lastId);
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { articleId: id };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      ...queryOptions,
      where,
      orderBy,
      include: {
        writer: true,
      },
    }),
    prisma.comment.count({ where }),
  ]);

  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    writer: {
      id: comment.writer.id,
      nickname: comment.writer.nickname,
      image: comment.writer.image,
    },
  }));

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].id : null;

  return { comments: formattedComments, total, queryOptions, nextCursor };
};

export const createArticleComment = async (content, id, writerId) => {
  const comment = await prisma.comment.create({
    data: { content: content, articleId: id, writerId: writerId },
  });

  return comment;
};

export const updateComment = async (id, data) => {
  const comment = await prisma.comment.update({
    where: { id: id },
    data,
  });

  return comment;
};

export const deleteComment = async (id) => {
  await prisma.comment.delete({ where: { id: id } });
  return;
};
