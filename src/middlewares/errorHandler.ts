import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (
    error.name === "UnauthorizedError" ||
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    console.error(`🔒 인증 에러: ${error.message}`);

    return res.status(401).json({
      path: req.path,
      method: req.method,
      message: error.message ?? "invalid token",
      date: new Date(),
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      path: req.path,
      method: req.method,
      message: "입력값 유효성 검증에 실패했습니다.",
      data: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
      date: new Date(),
    });
  }

  let status = typeof error.code === "number" ? error.code : 500;
  let message = error.message ?? "Internal Server Error";

  if (error.code === "P2002") {
    status = 400;
    message = "중복된 값이 존재합니다.";
  }

  if (error.code === "P2025") {
    status = 404;
    message = "요청한 리소스를 찾을 수 없습니다.";
  }

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message,
    data: error.data ?? undefined,
    date: new Date(),
  });
};

export default errorHandler;
