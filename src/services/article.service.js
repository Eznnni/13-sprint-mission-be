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
    prisma.article.findMany({
      where,
      orderBy: orderByQuery,
      skip,
      take,
      include: {
        writer: true,
      },
    }),
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
      id: article.writer.id,
      nickname: article.writer.nickname,
      image: article.writer.image,
    },
  }));

  return { articles: formattedArticles, total };
};

export const findArticleById = async (id) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: { writer: true },
  });

  if (!article) {
    throw new NotFoundError("해당 article을 찾을 수 없습니다");
  }

  return article;
};

export const createArticle = async (articleData) => {
  const article = await prisma.article.create({
    data: {
      title: articleData.title,
      content: articleData.content,
      writerId: articleData.writerId,
    },
  });

  return article;
};

export const updateArticle = async (id, data) => {
  const article = await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });

  return article;
};

export const deleteArticle = async (id) => {
  const article = await prisma.article.delete({ where: { id } });
  return;
};
