import express from "express";
import {
  getAllAvailableBooks,
  getAllBooks,
  insertNewBook,
  updateExistingBook,
} from "../controllers/bookController.js";
import {
  validateBook,
  validateBookID,
} from "../middlewares/validation/bookValidation.js";
import {
  adminAuthMiddleware,
  userAuthMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", userAuthMiddleware, getAllBooks);
router.get("/available", getAllAvailableBooks);

router.post(
  "/",
  userAuthMiddleware,
  adminAuthMiddleware,
  validateBook,
  insertNewBook
);

router.put(
  "/:id",
  userAuthMiddleware,
  adminAuthMiddleware,
  validateBookID,
  validateBook,
  updateExistingBook
);

export default router;
