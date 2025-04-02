import express from "express";

import {
  deleteExistingBook,
  getAllAvailableBooks,
  getAllBooks,
  getSingleBook,
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
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/admin", userAuthMiddleware, getAllBooks);
router.get("/", getAllAvailableBooks);
router.get("/:slug", getSingleBook)

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
  upload.array("bookImage"),
  validateBookID,
  validateUpdateBook,
  updateExistingBook
);

router.delete("/:id", userAuthMiddleware, adminAuthMiddleware, validateBookID, deleteExistingBook)

export default router;
