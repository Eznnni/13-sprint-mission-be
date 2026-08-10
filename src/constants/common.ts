import { Prisma } from "../generated/prisma";

export const PRODUCT_ORDERBY: Record<
  string,
  Prisma.ProductOrderByWithRelationInput
> = {
  recent: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  title: { name: "asc" },
  like: { likeCount: "desc" },
};

export const COMMENT_ORDERBY: Record<
  string,
  Prisma.CommentOrderByWithRelationInput
> = {
  recent: { createdAt: "desc" },
};
