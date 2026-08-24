import { prisma } from "../lib/prisma";
import { Article, Prisma, User } from "@prisma/client";

async function findArticlesAndCount({
  where,
  skip,
  take,
}: {
  where: Prisma.ArticleWhereInput;
  orderBy: Prisma.ArticleOrderByWithRelationInput;
  skip: number;
  take: number;
}) {
  return await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        writer: true,
      },
    }),
    prisma.article.count({ where }),
  ]);
}

async function findArticleById(id: Article["id"]) {
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
}

async function findArticleLike(userId: User["id"], articleId: Article["id"]) {
  return await prisma.articleLike.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
}

async function createArticle(
  articleData: Pick<Article, "title" | "content" | "writerId">,
) {
  return await prisma.article.create({
    data: {
      title: articleData.title,
      content: articleData.content,
      writerId: articleData.writerId,
    },
  });
}

async function updateArticle(
  id: Article["id"],
  data: Prisma.ArticleUpdateInput,
) {
  return await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

async function deleteArticle(id: Article["id"]) {
  return await prisma.article.delete({ where: { id } });
}

async function createArticleLikeWithIncrement(
  userId: User["id"],
  articleId: Article["id"],
) {
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.create({ data: { userId, articleId } });
    await tx.article.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
    });
  });
}

async function deleteArticleLikeWithDecrement(
  userId: User["id"],
  articleId: Article["id"],
) {
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

export default {
  findArticleById,
  findArticlesAndCount,
  findArticleLike,
  createArticle,
  updateArticle,
  deleteArticle,
  createArticleLikeWithIncrement,
  deleteArticleLikeWithDecrement,
};
