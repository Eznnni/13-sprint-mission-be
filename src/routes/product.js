import express from "express";
import * as ProductController from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", ProductController.getProductList);

router.get("/:id", ProductController.getProductBYId);

router.post("/", ProductController.postProduct);

router.patch("/:id", ProductController.patchProduct);

router.put("/:id", ProductController.upsertProduct);

router.delete("/:id", ProductController.deleteProduct);

export default router;
