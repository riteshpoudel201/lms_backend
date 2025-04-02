import { responseClient } from "../middlewares/responseClient.js";
import {
  createBook,
  deleteOneBook,
  getAllBook,
  getBooks,
  getOneBook,
  updateBook,
} from "../models/book/bookModel.js";
import slugify from "slugify";
import { deleteFile } from "../utils/fileUtils.js";

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
    return responseClient({
      req,
      res,
      message: "Books fetched successfully.",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleBook = async (req, res, next) => {
  const { slug } = req.params;
  
  try {
    const books = await getBooks({slug, status:'active'});
    return responseClient({
      req,
      res,
      message: "Books with slug: '"+ slug +"' fetched successfully.",
      data: books[0] || [],
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAvailableBooks = async (req, res, next) => {
  try {
    const books = await getBooks({ available: true, status: "active" });

    return responseClient({
      req,
      res,
      message: "Books fetched successfully.",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const insertNewBook = async (req, res, next) => {
  const user = req.userInfo;
  const { filename } = req.file;

  try {
    const newBook = req.body;
    const slugifiedTitle = slugify(newBook.title, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      locale: "vi",
      trim: true,
    });

    const book = await createBook({
      ...newBook,
      imageURL: `images/${filename}`,
      imageList:[`images/${filename}`],
      slug: slugifiedTitle,
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
  const files = req.files;
  let newImageList = [];

  if (files) {
    newImageList = files.map((file) => "images/" + file.filename);
  }

  try {
    const { id } = req.params;
    const existingBook = await getOneBook({_id:id}); // Fetch existing book from DB

    if (!existingBook) {
      return responseClient({
        req,
        res,
        message: "Book not found.",
        statusCode: 404,
      });
    }

    const existingImages = existingBook.imageList || [];
    const suppliedImages = req.body.imageList || [];
    const imagesToBeDeleted = existingImages.filter(img => !suppliedImages.includes(img));
    
    if (imagesToBeDeleted.length > 0) {
      Promise.all(imagesToBeDeleted.map(image => deleteFile(image)))
        .then(() => console.log("All images deleted successfully"))
        .catch(err => console.error("Error deleting some images:", err));
    }
    

    // Keep only common images + newly uploaded images
    const updatedImageList = [
      ...suppliedImages.filter((img) => existingImages.includes(img)), // Keep common images
      ...newImageList, // Add new ones
    ];

    // Update book with the filtered image list
    const book = await updateBook(
      { _id: id },
      {
        ...req.body,
        imageList: updatedImageList,
        lastUpdatedBy: {
          name: `${user.firstName} ${user.lastName}`,
          adminId: user._id,
        },
      }
    );

    if (book?.acknowledged) {
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

export const deleteExistingBook = async (req, res, next) => {
  const user = req.userInfo;

  try {
    const { id } = req.params;

    //get the book details
    const existingBook = await getOneBook({_id:id});

    //if there is image url , then delete
    if(existingBook.imageURL){
      deleteFile(existingBook.imageURL)
    }

    //if there are multiple images path, delete each individual images.
    if(existingBook?.imageList){
      existingBook.imageList.map(image=> deleteFile(image));
    }

    //finally delete the book data
    const deletedBook = await deleteOneBook({ _id: id });
    if (deletedBook?.deletedCount > 0) {
      return responseClient({
        req,
        res,
        message: "Book deleted successfully.",
      });
    }
    return responseClient({
      req,
      res,
      message: "Unable to delete book.",
      statusCode: 400,
    });
  } catch (error) {
    next(error);
  }
};
