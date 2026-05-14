import { z } from "zod";
import { AppError } from "./errors.js";

export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorList = err.issues || err.errors || [];
        return res.status(400).json({
          success: false,
          message: errorList[0]?.message,
          errors: errorList.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "데이터를 찾을 수 없습니다",
        });
      }

      if (err instanceof AppError) {
        return res.status(err.status).json({
          success: false,
          message: err.message,
        });
      }

      console.error(err);
      res.status(500).json({
        success: false,
        message: "서버 에러가 발생했습니다",
      });
    }
  };
};
