import { Prisma } from "../generated/prisma";
import { prisma } from "../lib/prisma";

async function findLikes({
  where,
  skip,
  take,
}: {
  where: Prisma.ProductLikeWhereInput;
  skip: number;
  take: number;
}) {
  return await Promise.all([
    prisma.productLike.findMany({
      where,
      skip,
      take,
      include: {
        product: {
          include: { writer: true, tags: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productLike.count({ where }),
  ]);
}

export default {
  findLikes,
};
