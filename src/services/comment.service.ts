import CommentRepository from "../repositories/comment.repository";
import { COMMENT_ORDERBY } from "../constants/common";
import { cursorPagination, CursorPaginationOptions } from "../lib/pagination";
import { Comment, Prisma, User } from "../generated/prisma";

type CommentWithWriter = Comment & {
  writer: User;
};

function formatCommentsResponse(
  comments: CommentWithWriter[],
  total: number,
  queryOptions: CursorPaginationOptions,
) {
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
}

async function findCommentList(
  target: { productId: number } | { articleId: number },
  limit: string | number | undefined,
  sort: string | undefined,
  lastId: string | number | undefined,
) {
  const queryOptions = cursorPagination(limit, lastId);
  const orderBy: Prisma.CommentOrderByWithRelationInput = COMMENT_ORDERBY[
    sort ?? ""
  ] ?? { createdAt: "desc" };
  const where: Prisma.CommentWhereInput = target;

  const [comments, total] = await CommentRepository.findCommentsAndCount({
    queryOptions,
    where,
    orderBy,
  });

  return formatCommentsResponse(comments, total, queryOptions);
}

async function createComment(
  content: string,
  target: { productId: number } | { articleId: number },
  writerId: number,
) {
  return await CommentRepository.createComment({
    content,
    writerId,
    ...target,
  });
}

interface UpdateCommentInput {
  content?: string;
}

async function updateComment(id: Comment["id"], data: UpdateCommentInput) {
  return await CommentRepository.updateComment(id, data);
}

async function deleteComment(id: Comment["id"]) {
  await CommentRepository.deleteComment(id);
  return;
}

export default {
  findCommentList,
  createComment,
  updateComment,
  deleteComment,
};
