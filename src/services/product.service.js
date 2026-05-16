import prisma from "../lib/prisma.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";

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
    prisma.product.findMany({ where, orderBy, skip, take }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pageNum, take };
};

export const findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product;
};

export const createProduct = async (newProduct) => {
  const { tags, ...rest } = newProduct;
  const product = await prisma.product.create({
    data: {
      ...rest,
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
  const product = await prisma.product.update({
    where: { id },
    data,
  });
  return product;
};

export const updateOrCreateProduct = async (
  id,
  name,
  description,
  tags,
  price,
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
