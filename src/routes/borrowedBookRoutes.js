import express from "express";

import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware.js";
import { borrowNewBook, getAllBorrowedBooks, getUserBorrowedBooks } from "../controllers/borrowBookController.js";
import { validateBorrowedBook } from "../middlewares/validation/borrowBookValidation.js";

const router = express.Router();

router.get("/admin", userAuthMiddleware, getAllBorrowedBooks);
router.get("/", userAuthMiddleware, getUserBorrowedBooks);

router.post(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
  validateBorrowedBook,
  borrowNewBook
);

// router.put(
//   "/:id",
//   userAuthMiddleware,
//   adminAuthMiddleware,
//   upload.array("bookImage"),
//   validateBookID,
//   validateUpdateBook,
//   updateExistingBook
// );

// router.delete("/:id", userAuthMiddleware, adminAuthMiddleware, validateBookID, deleteExistingBook)

export default router;
