import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import { ORDERBY } from "../constants/common.js";
import { idSchema } from "../schemas/common.schema.js";
import { offsetPagination } from "../utils/pagination.js";

export const getProductList = asyncHandler(async (req, res) => {
  const { page, limit, sort, search } = req.query;
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

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    filters: { search, sort },
    data: products,
  });
});

export const getProductBYId = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const product = await prisma.product.findUnique({
    where: { id },
  });
  res.json({ success: true, data: product });
});

export const postProduct = asyncHandler(async (req, res) => {
  const newProduct = await createProductSchema.parse(req.body);
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
  res.json({ success: true, data: product });
});

export const patchProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);
  const product = await prisma.product.update({
    where: { id },
    data,
  });
  res.json({ success: true, data: product });
});

export const upsertProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { name, description, tags, price } = req.body;

  const productId = parseInt(id) ?? 0;

  const product = await prisma.product.upsert({
    where: { id: productId },
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
      id: productId > 0 ? productId : undefined,
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
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const product = await prisma.product.delete({ where: { id } });
  res.json({ success: true, message: "Product가 삭제되었습니다" });
});
