import { NextFunction, Request, Response } from "express";
import createCommentSchema from "../schemas/comment.schema";
import { idSchema } from "../schemas/common.schema";
import CommentService from "../services/comment.service";
import { AuthenticationError } from "../types/errors";

async function getProductCommentList(
  req: Request<{}, {}, {}, { limit?: string; sort?: string; lastId?: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = idSchema.parse(req.params);
    const { limit, sort, lastId } = req.query;
    const { comments, total, queryOptions, nextCursor } =
      await CommentService.findCommentList(
        { productId: id },
        limit,
        sort,
        lastId,
      );

    res.json({
      success: true,
      limit: queryOptions.take,
      total,
      nextCursor,
      sort: sort,
      list: comments,
    });
  } catch (error) {
    next(error);
  }
}

async function postProductComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = idSchema.parse(req.params);
    const { content } = createCommentSchema.parse(req.body);
    const writerId = req.auth?.userId;

    if (!writerId) {
      throw new AuthenticationError("댓글을 작성하려면 로그인이 필요합니다.");
    }
    const comment = await CommentService.createComment(
      content,
      { productId: id },
      writerId!,
    );

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
}

async function getArticleComment(
  req: Request<{}, {}, {}, { limit?: string; sort?: string; lastId?: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = idSchema.parse(req.params);
    const { limit, sort, lastId } = req.query;
    const { comments, total, queryOptions, nextCursor } =
      await CommentService.findCommentList(
        { articleId: id },
        limit,
        sort,
        lastId,
      );

    res.json({
      success: true,
      limit: queryOptions.take,
      total,
      nextCursor: nextCursor,
      sort: sort,
      list: comments,
    });
  } catch (error) {
    next(error);
  }
}

async function postArticleComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = idSchema.parse(req.params);
    const { content } = createCommentSchema.parse(req.body);
    const writerId = req.auth?.userId;

    if (!writerId) {
      throw new AuthenticationError("댓글을 작성하려면 로그인이 필요합니다.");
    }
    const comment = await CommentService.createComment(
      content,
      { articleId: id },
      writerId!,
    );

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
}

async function patchComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const data = createCommentSchema.parse(req.body);
    const comment = await CommentService.updateComment(id, data);

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    await CommentService.deleteComment(id);

    res.json({ success: true, message: "comment가 삭제되었습니다" });
  } catch (error) {
    next(error);
  }
}

export default {
  getProductCommentList,
  postProductComment,
  getArticleComment,
  postArticleComment,
  patchComment,
  deleteComment,
};
