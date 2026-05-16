import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import articleRouter from "./src/routes/article.js";
import productRouter from "./src/routes/product.js";
import commentRouter from "./src/routes/comment.js";
import { PORT } from "./src/constants/common.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
