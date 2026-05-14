import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProductList = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, sort = "recent", search } = req.query;

  let products = await Product.find().select(
    "name price createdAt description tags",
  );

  if (search) {
    products = products.filter((product) => {
      const findName = product.name.includes(search);
      const findDescription = product.description.includes(search);

      return findName || findDescription;
    });
  }

  if (sort === "recent") {
    products.sort((a, b) => b.createdAt - a.createdAt);
  }

  const startIdx = Number(offset) || 0;
  const endIdx = startIdx + Number(limit);
  const displayIdx = products.slice(startIdx, endIdx);

  res.json({
    totalCount: products.length,
    list: displayIdx,
  });
});

export const getProductBYId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
  }
  res.json(product);
});

export const postProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

export const patchProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedProduct) {
    return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
  }
  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
  }
  res.json({ message: "삭제되었어요.", data: deletedProduct });
});
