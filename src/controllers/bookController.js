import { responseClient } from "../middlewares/responseClient.js";
import { createBook, getAllBook, updateBook } from "../models/book/bookModel.js";

export const getAllBooks = async (req, res, next) => {
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
    const books = await getAllBook();
    return responseClient({ req, res, message: "Books fetched successfully." });
  } catch (error) {
    next(error);
  }
};
export const getAllAvailableBooks = async (req, res, next) => {
  
  try {
    const books = await getAllBook();
    const availableBooks = books.filter((book) => book.available === true);
    return responseClient({
      req,
      res,
      message: "Books fetched successfully.",
      data: availableBooks,
    });
  } catch (error) {
    next(error);
  }
};
export const insertNewBook = async (req, res, next) => {
  const user = req.userInfo;
  
  try {
    const newBook = req.body;
    const book = await createBook({
      ...newBook,
      addedBy: {
        name: user.firstName + " " + user.lastName,
        adminId: user._id,
      },
    });
    if (book?._id) {
      return responseClient({
        req,
        res,
        message: "Book created successfully.",
      });
    }
    return responseClient({
      req,
      res,
      message: "Unable to create book.",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingBook = async (req, res, next) => {
  const user = req.userInfo;
  
  try {
    const existingBook = req.body;
    const { id } = req.params;
    const book = await updateBook({_id: id},{
      ...existingBook,
      lastUpdatedBy: {
        name: user.firstName + " " + user.lastName,
        adminId: user._id,
      },
    });
    if (book?._id) {
      return responseClient({
        req,
        res,
        message: "Book updated successfully.",
      });
    }
    return responseClient({
      req,
      res,
      message: "Unable to update book.",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
