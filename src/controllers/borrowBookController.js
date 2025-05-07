import {
  borrowBook,
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
      cart: newBook,
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
