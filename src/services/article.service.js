import * as articleRepository from "../repositories/article.repository.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";

const createNotFoundError = (message = "존재하지 않는 게시물입니다.") => {
  const error = new Error(message);
  error.code = 404;
  return error;
};

const formatArticleDetail = (article, isLiked) => ({
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
});

export const findArticle = async (page, pageSize, orderBy, keyword) => {
  const { take, skip } = offsetPagination(page, pageSize);

  const where = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderByQuery = ORDERBY[orderBy] ?? { createdAt: "desc" };

  const [articles, total] = await articleRepository.findArticlesAndCount({
    where,
    orderByQuery,
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

  return { articles: formattedArticles, total };
};

export const findArticleById = async (articleId, userId) => {
  const article = await articleRepository.findArticleById(articleId);

  if (!article) {
    throw createNotFoundError();
  }

  const like = await articleRepository.findArticleLike(userId, articleId);

  return formatArticleDetail(article, !!like);
};

export const createArticle = async (articleData) => {
  return await articleRepository.createArticle(articleData);
};

export const updateArticle = async (id, data) => {
  return await articleRepository.updateArticle(id, data);
};

export const deleteArticle = async (id) => {
  await articleRepository.deleteArticle(id);
  return;
};

export const addLikeArticle = async (articleId, userId) => {
  const existingArticle = await articleRepository.findArticleById(articleId);

  if (!existingArticle) {
    throw createNotFoundError();
  }

  const existingLike = await articleRepository.findArticleLike(
    userId,
    articleId,
  );

  if (!existingLike) {
    await articleRepository.createArticleLikeWithIncrement(userId, articleId);
  }

  const article = await articleRepository.findArticleById(articleId);
  return formatArticleDetail(article, true);
};

export const unLikeArticle = async (articleId, userId) => {
  const existingArticle = await articleRepository.findArticleById(articleId);

  if (!existingArticle) {
    throw createNotFoundError();
  }

  const existingLike = await articleRepository.findArticleLike(
    userId,
    articleId,
  );

  if (existingLike) {
    await articleRepository.deleteArticleLikeWithDecrement(userId, articleId);
  }

  const article = await articleRepository.findArticleById(articleId);
  return formatArticleDetail(article, false);
};
