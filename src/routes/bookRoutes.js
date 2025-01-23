import express from "express";
import { getAllAvailableBooks, getAllBooks, insertNewBook } from "../controllers/bookController.js";
import { validateBook } from "../middlewares/validation/bookValidation.js";
import { adminAuthMiddleware, userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",userAuthMiddleware ,getAllBooks);
router.get("/available" ,getAllAvailableBooks);

router.post("/", userAuthMiddleware,adminAuthMiddleware ,validateBook, insertNewBook)


export default router;
