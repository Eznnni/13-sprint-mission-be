import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수예요"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "상품소개는 필수예요."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "가격은 필수예요."],
      min: [0, "가격은 0 이상이어야 해요."],
    },
    tags: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
