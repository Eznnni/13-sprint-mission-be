import express from "express";
import * as CommentController from "../controllers/comment.controller.js";

const router = express.Router();

router.patch("/:id", CommentController.patchComment);

router.delete("/:id", CommentController.deleteComment);

export default router;
