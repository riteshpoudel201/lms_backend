import { model } from "mongoose";
import { BorrowBookSchema } from "./borrowBookSchema.js";
 const BookModel = model("BorrowBook", BorrowBookSchema);

 export const borrowBook =(book) =>{
    return  new BookModel(book).save();
 }
 export const borrowManyBook = (books) => {
   return BookModel.insertMany(books);
};

export const emptyBorrowBook = () => {
   return BookModel.deleteMany({});
};

 export const getAllBorrowedBook =() =>{
    return  BookModel.find().populate("book");
 }

 export const getBorrowedBooks = (filter) => {
   return BookModel.find(filter).populate("book");
 }

 export const getOneBorrowedBook =(filter) =>{
    return  BookModel.findOne(filter).populate("book");
 }

 export const updateBorrowedBook =(filter, updates) =>{
    return  BookModel.findOneAndUpdate(filter, {$set: updates},{new: true});
 }

 export const deleteOneBorrowedBook =(filter) =>{
    return  BookModel.deleteOne(filter);
 }

 export const deleteManyBorrowedBook =(filter) =>{
    return  BookModel.deleteMany(filter);
 }