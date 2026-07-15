import multer from "multer";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("images", 3);

export const uploadImages = (req, res, next) => {
  upload(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      const error = new Error("이미지는 최대 3개까지 등록 가능합니다.");
      error.code = 400;
      return next(error);
    }
    if (err) return next(err);
    next();
  });
};
