import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import productRouter from "./routes/product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/products", productRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중");
});
