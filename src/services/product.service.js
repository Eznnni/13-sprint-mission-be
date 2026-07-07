import prisma from "../config/prisma.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/errors.js";

export const findProduct = async (page, limit, sort, search) => {
  const { pageNum, take, skip } = offsetPagination(page, limit);

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { createdAt: "desc" };
  if (sort === "favorite") {
    orderBy = { likeCount: "desc" };
  } else if (ORDERBY && ORDERBY[sort]) {
    orderBy = ORDERBY[sort];
  }

  const [products, total] = await Promise.all([
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

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    likeCount: product.likeCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    tags: product.tags.map((tag) => tag.name),
    writer: {
      id: product.writer.id,
      nickname: product.writer.nickname,
      image: product.writer.image,
    },
  }));

  return { products: formattedProducts, total, pageNum, take };
};

export const findProductById = async (productId, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      writer: true,
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { writer: true },
      },
    },
  });

  if (!product) {
    const error = new Error("존재하지 않는 상품입니다.");
    error.code = 404;
    throw error;
  }

  const like = await prisma.productLike.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  return {
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    likeCount: product.likeCount,
    ownerNickname: product.writer.nickname,
    ownerId: product.writer.id,
    images: product.image ?? [],
    tags: product.tags.map((tag) => tag.name),
    price: product.price,
    description: product.description,
    name: product.name,
    id: product.id,
    isLiked: !!like,
    comments: product.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      writerId: comment.writer.id,
      writerNickname: comment.writer.nickname,
    })),
  };
};

export const createProduct = async (newProduct) => {
  const { tags, images, writerId, ...rest } = newProduct;
  const product = await prisma.product.create({
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

  return product;
};

export const updateProduct = async (id, data) => {
  const { tags, images, ...rest } = data;

  const updateData = { ...rest };

  if (images !== undefined) {
    updateData.image = images;
  }

  if (tags) {
    updateData.tags = {
      set: [],
      connectOrCreate: tags.map((tag) => ({
        where: { name: tag },
        create: { name: tag },
      })),
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { tags: true },
  });
  return product;
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
  return;
};

export const addLikeProduct = async (productId, userId) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { writer: true, tags: true },
  });

  if (!existingProduct) {
    const error = new Error("존재하지 않는 상품입니다.");
    error.code = 404;
    throw error;
  }

  const existingLike = await prisma.productLike.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!existingLike) {
    await prisma.$transaction(async (tx) => {
      await tx.productLike.create({ data: { userId, productId } });
      await tx.product.update({
        where: { id: productId },
        data: { likeCount: { increment: 1 } },
      });
    });
  }

  //트랜잭션 완료 후 refetch
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { writer: true, tags: true },
  });

  return {
    createdAt: product.createdAt,
    likeCount: product.likeCount,
    ownerNickname: product.writer.nickname,
    ownerId: product.writer.id,
    images: product.image ?? [],
    tags: product.tags.map((tag) => tag.name),
    price: product.price,
    name: product.name,
    description: product.description,
    id: product.id,
    isLiked: true,
  };
};

export const unLikeProduct = async (productId, userId) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { writer: true, tags: true },
  });

  if (!existingProduct) {
    const error = new Error("존재하지 않는 상품입니다.");
    error.code = 404;
    throw error;
  }

  const existingLike = await prisma.productLike.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existingLike) {
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

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { writer: true, tags: true },
  });

  return {
    createdAt: product.createdAt,
    likeCount: product.likeCount,
    ownerNickname: product.writer.nickname,
    ownerId: product.writer.id,
    images: product.image ?? [],
    tags: product.tags.map((tag) => tag.name),
    price: product.price,
    name: product.name,
    description: product.description,
    id: product.id,
    isLiked: false,
  };
};
