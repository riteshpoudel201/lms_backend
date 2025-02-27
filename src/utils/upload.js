import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const imageStorageFolder = "public/images";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    !fs.existsSync(imageStorageFolder) &&
      fs.mkdirSync(imageStorageFolder, { recursive: true });
    cb(null, imageStorageFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + "-" + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileExtensions = /jpeg|jpg|png|jiff|webp/;
  const mimeType = file.mimetype;
  const fileExtension = path.extname(file.originalname);
  const isAllowed =
    allowedFileExtensions.test(fileExtension) &&
    allowedFileExtensions.test(mimeType);
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images with this extensions [ jpeg|jpg|png|jiff|webp ] are allowed."
      ),
      false
    );
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export { upload };
