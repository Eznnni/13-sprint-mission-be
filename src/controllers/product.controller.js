import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import { idSchema } from "../schemas/common.schema.js";
import * as ProductService from "../services/product.service.js";
import auth from "../middlewares/auth.js";

export const getProductList = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.pageSize) || 10;
  const sort = req.query.orderBy || "recent";
  const search = req.query.keyword || "";

  const { products, total, pageNum, take } = await ProductService.findProduct(
    page,
    limit,
    sort,
    search,
  );

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    totalCount: total,
    totalPages: Math.ceil(total / take),
    filters: { search, sort },
    list: products,
  });
});

export const getProductBYId = asyncHandler(async (req, res) => {
  const { id: productId } = idSchema.parse(req.params);
  const userId = req.auth.userId;

  const product = await ProductService.findProductById(productId, userId);
  res.json({ success: true, data: product });
});

export const postProduct = asyncHandler(async (req, res) => {
  if (req.body.price) req.body.price = parseInt(req.body.price);
  if (typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = [];
    }
  }

  const validatedBody = await createProductSchema.parse(req.body);
  const writerId = req.auth.userId;

  const imagePaths = req.files
    ? req.files.map((file) => `/products/${file.filename}`)
    : [];

  const product = await ProductService.createProduct({
    name: validatedBody.name,
    description: validatedBody.description,
    price: validatedBody.price,
    tags: validatedBody.tags,
    writerId: writerId,
    images: imagePaths,
  });

  res.json({ success: true, data: product });
});

export const patchProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  if (req.body.price) req.body.price = parseInt(req.body.price);

  if (typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      req.body.tags = undefined;
    }
  }

  const validatedBody = await updateProductSchema.parse(req.body);

  let imagePaths = undefined;
  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => `/products/${file.filename}`);
  }

  const product = await ProductService.updateProduct(id, {
    ...validatedBody,
    images: imagePaths,
  });

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await ProductService.deleteProduct(id);

  res.json({ success: true, message: "Product가 삭제되었습니다" });
});

export const postProductLike = asyncHandler(async (req, res) => {
  const { id: productId } = idSchema.parse(req.params);
  const userId = req.auth.userId;

  const result = await ProductService.addLikeProduct(productId, userId);
  res.status(200).json(result);
});

export const deleteProductLike = asyncHandler(async (req, res) => {
  const { id: productId } = idSchema.parse(req.params);
  const userId = req.auth.userId;

  const result = await ProductService.unLikeProduct(productId, userId);
  res.status(200).json(result);
});
