import express from "express";
import * as ProductController from "../controllers/product.js";

const router = express.Router();

router.get("/", ProductController.getProductList);

router.get("/:id", ProductController.getProductBYId);

router.post("/", ProductController.postProduct);

router.patch("/:id", ProductController.patchProduct);

router.delete("/:id", ProductController.deleteProduct);

export default router;
