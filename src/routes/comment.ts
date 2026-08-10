import express from "express";
import auth from "../middlewares/auth";
import CommentController from "../controllers/comment.controller";

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
