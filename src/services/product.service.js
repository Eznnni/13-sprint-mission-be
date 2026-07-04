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

  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };

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

export const findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      writer: true,
      tags: true,
    },
  });

  if (!product) {
    throw new NotFoundError("해당 product를 찾을 수 없습니다");
  }

  return product;
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

export const updateOrCreateProduct = async (
  id,
  name,
  description,
  tags,
  price,
  writerId,
) => {
  const product = await prisma.product.upsert({
    where: { id: id },
    update: {
      name,
      description,
      price: parseInt(price),
      tags: {
        set: [],
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    create: {
      id: id > 0 ? id : undefined,
      name,
      description,
      price: parseInt(price),
      writerId: writerId,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
  });
  return product;
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
  return;
};
