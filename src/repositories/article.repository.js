import prisma from "../config/prisma.js";

export const findArticlesAndCount = async ({
  where,
  orderByQuery,
  skip,
  take,
}) => {
  return await Promise.all([
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
};

export const findArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id },
    include: {
      writer: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { writer: true },
      },
    },
  });
};

export const findArticleLike = async (userId, articleId) => {
  return await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
};

export const createArticle = async (articleData) => {
  return await prisma.article.create({
    data: {
      title: articleData.title,
      content: articleData.content,
      writerId: articleData.writerId,
    },
  });
};

export const updateArticle = async (id, data) => {
  return await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
};

export const deleteArticle = async (id) => {
  return await prisma.article.delete({ where: { id } });
};

export const createArticleLikeWithIncrement = async (userId, articleId) => {
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.create({ data: { userId, articleId } });
    await tx.article.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
    });
  });
};

export const deleteArticleLikeWithDecrement = async (userId, articleId) => {
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.delete({
      where: { userId_articleId: { userId, articleId } },
    });
    await tx.article.update({
      where: { id: articleId },
      data: { likeCount: { decrement: 1 } },
    });
  });
};
