import multer from "multer";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../types/errors";
import { randomUUID } from "crypto";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).array("images", 3);

export const uploadImages = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return next(
        new BadRequestError("이미지는 최대 3개까지 등록 가능합니다."),
      );
    }
    if (err) {
      return next(err);
    }
    next();
  });
};
