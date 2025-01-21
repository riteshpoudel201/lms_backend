import { model } from "mongoose";
import { BookSchema } from "./bookSchema.js";
 const BookModel = model("Books", BookSchema);

 export const createBook =(book) =>{
    return  new BookModel(book).save();
 }

 export const getAllBook =() =>{
    return  BookModel.find();
 }

 export const getOneBook =(filter) =>{
    return  BookModel.findOne(filter);
 }

 export const updateBook =(filter, updates) =>{
    return  BookModel.updateOne(filter, updates);
 }

 export const deleteOneBook =(filter) =>{
    return  BookModel.deleteOne(filter);
 }

 export const deleteManyBook =(filter) =>{
    return  BookModel.deleteMany(filter);
 }