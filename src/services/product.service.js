import * as productRepository from "../repositories/product.repository.js";
import { ORDERBY } from "../constants/common.js";
import { offsetPagination } from "../utils/pagination.js";

// 에러 객체 생성 헬퍼 함수
const createNotFoundError = (message = "존재하지 않는 상품입니다.") => {
  const error = new Error(message);
  error.code = 404;
  return error;
};

// 좋아요용 데이터 포맷터 헬퍼 함수
const formatProductLikeStatus = (product, isLiked) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  images: product.image ?? [],
  tags: product.tags.map((tag) => tag.name),
  likeCount: product.likeCount,
  createdAt: product.createdAt,
  ownerId: product.writer.id,
  ownerNickname: product.writer.nickname,
  isLiked,
});

export const findProduct = async (page, limit, sort, search) => {
  const { pageNum, take, skip } = offsetPagination(page, limit);

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { createdAt: "desc" };
  if (sort === "favorite") {
    orderBy = { likeCount: "desc" };
  } else if (ORDERBY && ORDERBY[sort]) {
    orderBy = ORDERBY[sort];
  }

  const [products, total] = await productRepository.findProductsAndCount({
    where,
    orderBy,
    skip,
    take,
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    likeCount: product.likeCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    tags: product.tags.map((tag) => tag.name),
    writer: {
      id: product.writer.id,
      nickname: product.writer.nickname,
      image: product.writer.image,
    },
  }));

  return { products: formattedProducts, total, pageNum, take };
};

export const findProductById = async (productId, userId) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw createNotFoundError();
  }

  const like = await productRepository.findProductLike(userId, productId);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.image ?? [],
    tags: product.tags.map((tag) => tag.name),
    likeCount: product.likeCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ownerId: product.writer.id,
    ownerNickname: product.writer.nickname,
    isLiked: !!like,
    comments: product.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      writerId: comment.writer.id,
      writerNickname: comment.writer.nickname,
    })),
  };
};

export const createProduct = async (newProduct) => {
  const { tags, images, writerId, ...rest } = newProduct;
  return await productRepository.createProduct({
    rest,
    images,
    writerId,
    tags,
  });
};

export const updateProduct = async (id, data) => {
  const { tags, images, ...rest } = data;
  const updateData = { ...rest };

  if (images !== undefined) {
    updateData.image = images;
  }

  if (tags) {
    updateData.tags = {
      set: [],
      connectOrCreate: tags.map((tag) => ({
        where: { name: tag },
        create: { name: tag },
      })),
    };
  }

  return await productRepository.updateProduct(id, updateData);
};

export const deleteProduct = async (id) => {
  await productRepository.deleteProduct(id);
  return;
};

export const addLikeProduct = async (productId, userId) => {
  const existingProduct = await productRepository.findProductById(productId);

  if (!existingProduct) {
    throw createNotFoundError();
  }

  const existingLike = await productRepository.findProductLike(
    userId,
    productId,
  );

  if (!existingLike) {
    await productRepository.createProductLikeWithIncrement(userId, productId);
  }

  const product = await productRepository.findProductById(productId);
  return formatProductLikeStatus(product, true);
};

export const unLikeProduct = async (productId, userId) => {
  const existingProduct = await productRepository.findProductById(productId);

  if (!existingProduct) {
    throw createNotFoundError();
  }

  const existingLike = await productRepository.findProductLike(
    userId,
    productId,
  );

  if (existingLike) {
    await productRepository.deleteProductLikeWithDecrement(userId, productId);
  }

  const product = await productRepository.findProductById(productId);
  return formatProductLikeStatus(product, false);
};
