import { connectMongoose } from "../config/db.js";
import { createManyBook, emptyBook } from "../models/book/bookModel.js";
import books from "./book-seeds.js";

const importData = async () => {
  try {
    await connectMongoose();
    await emptyBook();
    await createManyBook(books);
  } catch (error) {
    console.log(error)
  }
};

importData();
