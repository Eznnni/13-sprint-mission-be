import { Comment, Prisma, User } from "../generated/prisma";
import { prisma } from "../lib/prisma";

type FindCommentsParams = {
  queryOptions: { take: number; skip?: number; cursor?: { id: number } };
  where: Prisma.CommentWhereInput;
  orderBy: Prisma.CommentOrderByWithRelationInput;
};

async function findCommentsAndCount({
  queryOptions,
  where,
  orderBy,
}: FindCommentsParams) {
  return await Promise.all([
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
}

interface CreateCommentInput {
  content: string;
  writerId: User["id"];
  productId?: number;
  articleId?: number;
}

async function createComment(data: CreateCommentInput) {
  return await prisma.comment.create({ data });
}

interface UpdateCommentInput {
  content?: string;
}

async function updateComment(id: Comment["id"], data: UpdateCommentInput) {
  return await prisma.comment.update({
    where: { id },
    data,
  });
}

async function deleteComment(id: Comment["id"]) {
  return await prisma.comment.delete({ where: { id } });
}

export default {
  findCommentsAndCount,
  createComment,
  updateComment,
  deleteComment,
};
