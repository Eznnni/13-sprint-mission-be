import prisma from "../config/prisma.js";

export const findProductsAndCount = async ({ where, orderBy, skip, take }) => {
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
};

export const findProductById = async (id) => {
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
};

export const findProductLike = async (userId, productId) => {
  return await prisma.productLike.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });
};

export const createProduct = async ({ rest, images, writerId, tags }) => {
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
};

export const updateProduct = async (id, updateData) => {
  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: { tags: true },
  });
};

export const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id } });
};

export const createProductLikeWithIncrement = async (userId, productId) => {
  await prisma.$transaction(async (tx) => {
    await tx.productLike.create({ data: { userId, productId } });
    await tx.product.update({
      where: { id: productId },
      data: { likeCount: { increment: 1 } },
    });
  });
};

export const deleteProductLikeWithDecrement = async (userId, productId) => {
  await prisma.$transaction(async (tx) => {
    await tx.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
    await tx.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
    });
  });
};
