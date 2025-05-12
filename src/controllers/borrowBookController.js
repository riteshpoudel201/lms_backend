import { responseClient } from "../middlewares/responseClient.js";
import {
  borrowBook,
  borrowManyBook,
  getAllBorrowedBook,
  getBorrowedBooks,
} from "../models/borrow/borrowBookModel.js";

const BOOK_DUE_DATE = 15;

export const getAllBorrowedBooks = async (req, res, next) => {
  const { role } = req.userInfo;
  if (role !== "admin") {
    return responseClient({
      req,
      res,
      message: "User unauthorized.",
      statusCode: 401,
    });
  }
  try {
    const books = await getAllBorrowedBook();
    return responseClient({
      req,
      res,
      message: "All borrowed books fetched successfully.",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBorrowedBooks = async (req, res, next) => {
  const { _id: userId } = req.userInfo;
  if (!userId) {
    return responseClient({
      req,
      res,
      message: "User unauthenticated. Please login and try again.",
      statusCode: 401,
    });
  }
  try {
    const books = await getBorrowedBooks({ userId });
    return responseClient({
      req,
      res,
      message: "Borrowed books of the user is fetched successfully.",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const borrowNewBook = async (req, res, next) => {
  const user = req.userInfo;

  try {
    const newBook = req.body;
    const dueDate = new Date().setDate(new Date().getDate() + BOOK_DUE_DATE);
    const book = await borrowBook({
      ...newBook,
      userId: user._id,
      dueDate,
    });
    if (book?._id) {
      return responseClient({
        req,
        res,
        message: "Book borrowed successfully.",
      });
    }
    return responseClient({
      req,
      res,
      message: "Unable to borrow book.",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
export const borrowMultipleNewBook = async (req, res, next) => {
  const user = req.userInfo;
  console.log("Reqest Body: ", req.body);
  if (!Array.isArray(req.body)) {
    return responseClient({
      req,
      res,
      message: "Expected an array of books.",
      statusCode: 400,
    });
  }
  try {
    const dueDate = new Date().setDate(new Date().getDate() + BOOK_DUE_DATE);

    const newBook = req.body.map((item) => ({
      book: item.book,
      reviewId: item.reviewId,
      returnedDate: item.returnedDate,
      userId: user._id,
      dueDate,
    }));
    console.log("Newly borrowed book details: ", newBook);

    const book = await borrowManyBook(newBook);

    if (book.length > 0) {
      const ids = book.map(doc=> doc._id)
      const listedBooks = await getBorrowedBooks({_id : { $in: ids }})
      console.log("Populated book: ", listedBooks)
      console.log("Inserted book: ", ids)
      return responseClient({
        req,
        res,
        message: "Books are borrowed successfully.",
        data: listedBooks,
      });
    }
    return responseClient({
      req,
      res,
      message: "Unable to borrow book.",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
