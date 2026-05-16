import prisma from "../lib/prisma.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";

export const findArticle = async (page, limit, sort, search) => {
  const { pageNum, take, skip } = offsetPagination(page, limit);

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = ORDERBY[sort] ?? { createdAt: "desc" };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy, skip, take }),
    prisma.article.count({ where }),
  ]);

  return { articles, total, pageNum, take };
};

export const findArticleById = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  return article;
};

export const createArticle = async (title, content) => {
  const article = await prisma.article.create({
    data: { title: title, content: content },
  });

  return article;
};

export const updateArticle = async (id, data) => {
  const article = await prisma.article.update({
    where: { id },
    data,
  });
  return article;
};

export const deleteArticle = async (id) => {
  await prisma.article.delete({ where: { id } });
  return;
};
