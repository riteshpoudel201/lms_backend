import express from "express";

import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  borrowMultipleNewBook,
  borrowNewBook,
  getAllBorrowedBooks,
  getUserBorrowedBooks,
  returnBorrowedBook,
} from "../controllers/borrowBookController.js";
import { validateBorrowedBook } from "../middlewares/validation/borrowBookValidation.js";

const router = express.Router();

router.get("/admin", userAuthMiddleware,adminAuthMiddleware, getAllBorrowedBooks);
router.get("/", userAuthMiddleware, getUserBorrowedBooks);

router.post(
  "/",
  userAuthMiddleware,
  validateBorrowedBook,
  borrowNewBook
);
router.post(
  "/many",
  userAuthMiddleware,
  validateBorrowedBook,
  borrowMultipleNewBook
);

router.patch(
  "/",
  userAuthMiddleware,
  returnBorrowedBook
);

// router.delete("/:id", userAuthMiddleware, adminAuthMiddleware, validateBookID, deleteExistingBook)

export default router;
