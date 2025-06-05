import { Types } from "mongoose";
import { responseClient } from "../middlewares/responseClient.js";
import { updateBook } from "../models/book/bookModel.js";
import {
  borrowBook,
  borrowManyBook,
  getAllBorrowedBook,
  getBorrowedBooks,
  updateBorrowedBook,
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
  console.log("Inside multiple insertion.");
  const user = req.userInfo;
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
    console.log("Borrowed Book Payload: ", newBook);
    const borrowedBooks = await borrowManyBook(newBook);

    if (borrowedBooks.length > 0) {
      const ids = borrowedBooks.map((doc) => doc._id);
      const listedBooks = await getBorrowedBooks({ _id: { $in: ids } });
      console.log("All borrowed books: ", borrowedBooks);

      borrowedBooks.map(async (b) => {
        await updateBook({
          _id: b.book.toString(),
          expectedAvailabilityDate: dueDate,
        });
      });

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
    console.log("Errors", error);
    next(error);
  }
};

export const returnBorrowedBook = async (req, res) => {
  const user = req.userInfo;
  const borrow = req.body;

  console.log("User with authority: ", user);
  console.log("User for update: ", borrow.userId);
  if (!borrow || !borrow._id) {
    throw new Error("Missing borrow or borrow._id");
  }
  if (user._id.toString() !== borrow.userId) {
    return responseClient({
      req,
      res,
      message: "Unable to update book. User unauthorized.",
      statusCode: 403,
    });
  }
  console.log("Borrowed Book: ", borrow);

  //make expectedAvailabilityDate of book null

  const filterBook = {
    _id: borrow?.book?._id,
  };

  const bookObj = {
    expectedAvailabilityDate: null,
  };

  //set returned date from borrow to current date
  const borrowFilter = {
    _id: borrow?._id,
    userId: user?._id,
  };

  const borrowObj = {
    isReturned: true,
    returnedDate: Date.now(),
  };
  try {
    const result = await updateBorrowedBook(borrowFilter, borrowObj);
    console.log("Update Borrow Result: ", result);
    if (result?._id) {
      const updatedBook = await updateBook(filterBook, bookObj);

      console.log("Update Book Result: ", updatedBook);
      if (updatedBook?.acknowledged) {
        return responseClient({
          req,
          res,
          message: "Book returned successfully.",
        });
      }
      return responseClient({
        req,
        res,
        message: "Unable to update book. Please contact admin.",
        statusCode: 500,
      });
    }
  } catch (error) {
    return responseClient({
      req,
      res,
      message: "Unable to return book. Please contact administrator ASAP.",
      statusCode: 500,
    });
  }

  //
};
