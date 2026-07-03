import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PORT } from "./constants/common.js";
import errorHandler from "./middlewares/errorHandler.js";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";
import commentRouter from "./routes/comment.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);
app.use("/users/me", userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
