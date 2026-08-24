import { Prisma, Product, User } from "@prisma/client";
import { prisma } from "../lib/prisma";

type FindProductsParams = {
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  skip: number;
  take: number;
};

type CreateProductParams = {
  rest: Omit<Prisma.ProductCreateInput, "writer" | "image" | "tags">;
  images?: string[];
  writerId: User["id"];
  tags?: string[];
};

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

async function findProductsAndCount({
  where,
  orderBy,
  skip,
  take,
}: FindProductsParams) {
  return await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        writer: true,
        tags: true,
      },
    }),
    prisma.product.count({ where }),
  ]);
}

async function findProductById(id: Product["id"]) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      writer: true,
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { writer: true },
      },
    },
  });
}

async function findProductLike(userId: User["id"], productId: Product["id"]) {
  return await prisma.productLike.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });
}

async function createProduct({
  rest,
  images,
  writerId,
  tags,
}: CreateProductParams) {
  return await prisma.product.create({
    data: {
      ...rest,
      image: images ?? [],
      writerId: writerId,
      tags: {
        connectOrCreate: tags?.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: {
      tags: true,
    },
  });
}

async function updateProduct(
  id: Product["id"],
  updateData: Prisma.ProductUpdateInput,
) {
  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: { tags: true },
  });
}

async function deleteProduct(id: Product["id"]) {
  return await prisma.product.delete({ where: { id } });
}

async function createProductLikeWithIncrement(
  userId: User["id"],
  productId: Product["id"],
) {
  await prisma.$transaction(async (tx) => {
    await tx.productLike.create({ data: { userId, productId } });
    await tx.product.update({
      where: { id: productId },
      data: { likeCount: { increment: 1 } },
    });
  });
}

async function deleteProductLikeWithDecrement(
  userId: User["id"],
  productId: Product["id"],
) {
  await prisma.$transaction(async (tx) => {
    await tx.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
    await tx.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
    });
  });
}

export default {
  findLikes,
  findProductsAndCount,
  findProductById,
  findProductLike,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductLikeWithIncrement,
  deleteProductLikeWithDecrement,
};
