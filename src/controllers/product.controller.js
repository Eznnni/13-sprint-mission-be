import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import { idSchema } from "../schemas/common.schema.js";
import * as ProductService from "../services/product.service.js";

export const getProductList = asyncHandler(async (req, res) => {
  const { page, limit, sort, search } = req.query;
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
    total,
    totalPages: Math.ceil(total / take),
    filters: { search, sort },
    data: products,
  });
});

export const getProductBYId = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const product = await ProductService.findProductById(id);

  res.json({ success: true, data: product });
});

export const postProduct = asyncHandler(async (req, res) => {
  const validatedBody = await createProductSchema.parse(req.body);
  const writerId = req.auth.userId;

  const product = await ProductService.createProduct({
    name: validatedBody.name,
    description: validatedBody.description,
    price: validatedBody.price,
    tags: validatedBody.tags,
    writerId: writerId,
  });

  res.json({ success: true, data: product });
});

export const patchProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);
  const product = await ProductService.updateProduct(id, data);

  res.json({ success: true, data: product });
});

export const upsertProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  const { name, description, tags, price } = req.body;
  const writerId = req.auth.userId;

  const product = await ProductService.updateOrCreateProduct(
    id,
    name,
    description,
    tags,
    price,
    writerId,
  );

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  await ProductService.deleteProduct(id);

  res.json({ success: true, message: "Product가 삭제되었습니다" });
});
