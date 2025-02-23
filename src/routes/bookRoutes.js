import express from "express";
import multer from "multer";
import {
  deleteExistingBook,
  getAllAvailableBooks,
  getAllBooks,
  insertNewBook,
  updateExistingBook,
} from "../controllers/bookController.js";
import {
  validateBook,
  validateBookID,
  validateUpdateBook,
} from "../middlewares/validation/bookValidation.js";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({dest:"/uploads"})

router.get("/admin", userAuthMiddleware, getAllBooks);
router.get("/", getAllAvailableBooks);

router.post(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
  upload.single("bookImage"),
  validateBook,
  insertNewBook
);

router.put(
  "/:id",
  userAuthMiddleware,
  adminAuthMiddleware,
  validateBookID,
  validateUpdateBook,
  updateExistingBook
);

router.delete("/:id", userAuthMiddleware, adminAuthMiddleware, validateBookID, deleteExistingBook)

export default router;
