import productRepository from "../repositories/product.repository";
import { PRODUCT_ORDERBY } from "../constants/common";
import { offsetPagination } from "../lib/pagination";
import { NotFoundError } from "../types/errors";
import { Prisma, Product, Tag, User } from "../generated/prisma";

type ProductWithWriterAndTags = Product & {
  writer: User;
  tags: Tag[];
};

function formatProductLikeStatus(
  product: ProductWithWriterAndTags,
  isLiked: boolean,
) {
  return {
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
  };
}

async function findProduct(
  page: number,
  pageSize: number,
  sort: string,
  keyword: string,
) {
  const { pageNum, take, skip } = offsetPagination(page, pageSize);

  const where: Prisma.ProductWhereInput = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = PRODUCT_ORDERBY[
    sort
  ] ?? { createdAt: "desc" };

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
}

async function findProductById(productId: Product["id"], userId: User["id"]) {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw new NotFoundError("해당 상품이 존재하지 않습니다.");
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
}

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  writerId: number;
  images: string[];
}

async function createProduct(newProduct: CreateProductInput) {
  const { tags, images, writerId, ...rest } = newProduct;
  return await productRepository.createProduct({
    rest,
    images,
    writerId,
    tags,
  });
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}

async function updateProduct(id: Product["id"], data: UpdateProductInput) {
  const { tags, images, ...rest } = data;
  const updateData: Prisma.ProductUpdateInput = { ...rest };

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
}

async function deleteProduct(id: Product["id"]) {
  await productRepository.deleteProduct(id);
  return;
}

async function addLikeProduct(productId: Product["id"], userId: User["id"]) {
  const existingProduct = await productRepository.findProductById(productId);

  if (!existingProduct) {
    throw new NotFoundError("해당 상품이 존재하지 않습니다.");
  }

  const existingLike = await productRepository.findProductLike(
    userId,
    productId,
  );

  if (!existingLike) {
    await productRepository.createProductLikeWithIncrement(userId, productId);
  }

  const product = await productRepository.findProductById(productId);
  return formatProductLikeStatus(product!, true);
}

async function unLikeProduct(productId: Product["id"], userId: User["id"]) {
  const existingProduct = await productRepository.findProductById(productId);

  if (!existingProduct) {
    throw new NotFoundError("해당 상품이 존재하지 않습니다.");
  }

  const existingLike = await productRepository.findProductLike(
    userId,
    productId,
  );

  if (existingLike) {
    await productRepository.deleteProductLikeWithDecrement(userId, productId);
  }

  const product = await productRepository.findProductById(productId);
  return formatProductLikeStatus(product!, false);
}

export default {
  findProduct,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addLikeProduct,
  unLikeProduct,
};
