import prisma from "../config/prisma.js";
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

export const findArticleById = async (articleId, userId) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      writer: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { writer: true },
      },
    },
  });

  if (!article) {
    const error = new Error("존재하지 않는 게시물입니다.");
    error.code = 404;
    throw error;
  }

  const like = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
  return {
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    likeCount: article.likeCount,
    writer: {
      nickname: article.writer.nickname,
      id: article.writer.id,
    },
    images: article.image ?? [],
    content: article.content,
    title: article.title,
    id: article.id,
    isLiked: !!like,
  };
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

export const addLikeArticle = async (articleId, userId) => {
  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
    include: { writer: true },
  });

  if (!existingArticle) {
    const error = new Error("존재하지 않는 게시물입니다.");
    error.code = 404;
    throw error;
  }

  const existingLike = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (!existingLike) {
    await prisma.$transaction(async (tx) => {
      await tx.articleLike.create({ data: { userId, articleId } });
      await tx.article.update({
        where: { id: articleId },
        data: { likeCount: { increment: 1 } },
      });
    });
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { writer: true },
  });

  return {
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    likeCount: article.likeCount,
    writer: {
      nickname: article.writer.nickname,
      id: article.writer.id,
    },
    images: article.image ?? [],
    content: article.content,
    title: article.title,
    id: article.id,
    isLiked: true,
  };
};

export const unLikeArticle = async (articleId, userId) => {
  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
    include: { writer: true },
  });

  if (!existingArticle) {
    const error = new Error("존재하지 않는 게시물입니다.");
    error.code = 404;
    throw error;
  }

  const existingLike = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  if (existingLike) {
    await prisma.$transaction(async (tx) => {
      await tx.articleLike.delete({
        where: { userId_articleId: { userId, articleId } },
      });
      await tx.article.update({
        where: { id: articleId },
        data: { likeCount: { decrement: 1 } },
      });
    });
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { writer: true },
  });

  return {
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    likeCount: article.likeCount,
    writer: {
      nickname: article.writer.nickname,
      id: article.writer.id,
    },
    images: article.image ?? [],
    content: article.content,
    title: article.title,
    id: article.id,
    isLiked: false,
  };
};
