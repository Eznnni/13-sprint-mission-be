import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PRODUCT_ENDPOINT = "/products";

app.post(
  `${PRODUCT_ENDPOINT}`,
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  }),
);

app.get(
  `${PRODUCT_ENDPOINT}/:id`,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }
    res.json(product);
  }),
);

app.patch(
  `${PRODUCT_ENDPOINT}/:id`,
  asyncHandler(async (req, res) => {
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
  }),
);

app.delete(
  `${PRODUCT_ENDPOINT}/:id`,
  asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }
    res.json({ message: "삭제되었어요.", data: deletedProduct });
  }),
);

app.get(
  `${PRODUCT_ENDPOINT}`,
  asyncHandler(async (req, res) => {
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
  }),
);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중");
});
