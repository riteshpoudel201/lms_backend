import express from "express";
import { getAllAvailableBooks, getAllBooks, insertNewBook } from "../controllers/bookController.js";
import { validateBook } from "../middlewares/validation/bookValidation.js";

const router = express.Router();

router.get("/books",userAuthMiddleware ,getAllBooks);
router.get("/books/available",userAuthMiddleware ,getAllAvailableBooks);

router.post("/books", validateBook, insertNewBook)


export default router;
