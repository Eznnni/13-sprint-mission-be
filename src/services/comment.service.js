import * as commentRepository from "../repositories/comment.repository.js";
import { ORDERBY } from "../constants/common.js";
import { cursorPagination } from "../utils/pagination.js";

const formatCommentsResponse = (comments, total, queryOptions) => {
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

export const findProductCommentList = async (id, limit, sort, lastId) => {
  const queryOptions = cursorPagination(limit, lastId);
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { productId: id };

  const [comments, total] = await commentRepository.findCommentsAndCount({
    queryOptions,
    where,
    orderBy,
  });

  return formatCommentsResponse(comments, total, queryOptions);
};

export const createProductComment = async (content, id, writerId) => {
  return await commentRepository.createComment({
    content,
    productId: id,
    writerId,
  });
};

export const findArticleCommentList = async (id, limit, sort, lastId) => {
  const queryOptions = cursorPagination(limit, lastId);
  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };
  const where = { articleId: id };

  const [comments, total] = await commentRepository.findCommentsAndCount({
    queryOptions,
    where,
    orderBy,
  });

  return formatCommentsResponse(comments, total, queryOptions);
};

export const createArticleComment = async (content, id, writerId) => {
  return await commentRepository.createComment({
    content,
    articleId: id,
    writerId,
  });
};

export const updateComment = async (id, data) => {
  return await commentRepository.updateComment(id, data);
};

export const deleteComment = async (id) => {
  await commentRepository.deleteComment(id);
  return;
};
