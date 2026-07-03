import express from "express";
import * as CommentController from "../controllers/comment.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isCommentOwner,
  CommentController.patchComment,
);

router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isCommentOwner,
  CommentController.deleteComment,
);

export default router;
