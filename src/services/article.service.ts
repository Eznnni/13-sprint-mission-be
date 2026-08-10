import ArticleRepository from "../repositories/article.repository";
import { ARTICLE_ORDERBY } from "../constants/common";
import { offsetPagination } from "../lib/pagination";
import { NotFoundError } from "../types/errors";
import { Article, Prisma, User } from "../generated/prisma";

type ArticleWithWriter = Article & {
  writer: User;
};

function formatArticleDetail(article: ArticleWithWriter, isLiked: boolean) {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    images: article.image ?? [],
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    writer: {
      id: article.writer.id,
      nickname: article.writer.nickname,
    },
    isLiked,
  };
}

async function findArticle(
  page: number,
  pageSize: number,
  sort: string,
  keyword: string,
) {
  const { pageNum, take, skip } = offsetPagination(page, pageSize);

  const where: Prisma.ArticleWhereInput = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ArticleOrderByWithRelationInput = ARTICLE_ORDERBY[
    sort
  ] ?? { createdAt: "desc" };

  const [articles, total] = await ArticleRepository.findArticlesAndCount({
    where,
    orderBy,
    skip,
    take,
  });

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

  return { articles: formattedArticles, total, pageNum, take };
}

async function findArticleById(articleId: Article["id"], userId: User["id"]) {
  const article = await ArticleRepository.findArticleById(articleId);

  if (!article) {
    throw new NotFoundError("해당 게시물이 존재하지 않습니다.");
  }

  const like = await ArticleRepository.findArticleLike(userId, articleId);

  return formatArticleDetail(article, !!like);
}

interface CreateArticleInput {
  title: string;
  content: string;
  writerId: number;
  images: string[];
}

async function createArticle(articleData: CreateArticleInput) {
  return await ArticleRepository.createArticle(articleData);
}

interface UpdateArticleInput {
  title?: string;
  content?: string;
  images?: string[];
}

async function updateArticle(id: Article["id"], data: UpdateArticleInput) {
  return await ArticleRepository.updateArticle(id, data);
}

async function deleteArticle(id: Article["id"]) {
  await ArticleRepository.deleteArticle(id);
  return;
}

async function addLikeArticle(articleId: Article["id"], userId: User["id"]) {
  const existingArticle = await ArticleRepository.findArticleById(articleId);

  if (!existingArticle) {
    throw new NotFoundError("해당 게시물이 존재하지 않습니다.");
  }

  const existingLike = await ArticleRepository.findArticleLike(
    userId,
    articleId,
  );

  if (!existingLike) {
    await ArticleRepository.createArticleLikeWithIncrement(userId, articleId);
  }

  const article = await ArticleRepository.findArticleById(articleId);
  return formatArticleDetail(article!, true);
}

async function unLikeArticle(articleId: Article["id"], userId: User["id"]) {
  const existingArticle = await ArticleRepository.findArticleById(articleId);

  if (!existingArticle) {
    throw new NotFoundError("해당 게시물이 존재하지 않습니다.");
  }

  const existingLike = await ArticleRepository.findArticleLike(
    userId,
    articleId,
  );

  if (existingLike) {
    await ArticleRepository.deleteArticleLikeWithDecrement(userId, articleId);
  }

  const article = await ArticleRepository.findArticleById(articleId);
  return formatArticleDetail(article!, false);
}

export default {
  findArticle,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addLikeArticle,
  unLikeArticle,
};
