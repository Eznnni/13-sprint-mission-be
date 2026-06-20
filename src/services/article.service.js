import prisma from "../lib/prisma.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/errors.js";

export const findArticle = async (page, pageSize, orderBy, keyword) => {
  const { pageNum, take, skip } = offsetPagination(page, pageSize);

  const where = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderByQuery = ORDERBY[orderBy] ?? { createdAt: "desc" };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy: orderByQuery, skip, take }),
    prisma.article.count({ where }),
  ]);

  const formattedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image,
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    writer: {
      id: article.userId,
      nickname: article.writerName || "총명한 판다",
    },
  }));

  return { articles: formattedArticles, total };
};

export const findArticleById = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError("해당 article을 찾을 수 없습니다");
  }

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
  const article = await prisma.article.delete({ where: { id } });

  return;
};
