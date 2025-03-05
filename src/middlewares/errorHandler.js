import { deleteUploadedFiles } from "../utils/fileUtils.js";
import { responseClient } from "./responseClient.js";

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "An unexpected error occurred.";

  if(req.file || Array.isArray(req.files)){
    deleteUploadedFiles(req);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `The ${field} "${error.keyValue[field]}" is already taken. Please use a different one.`;
    statusCode = 400;
  } else if (error.name === "ValidationError") {
    message = Object.values(error.errors).map(e => e.message).join(", ");
    statusCode = 400;
  } else if (error.name === "CastError") {
    message = `Invalid value for ${error.path}: "${error.value}". Please enter a valid ${error.kind}.`;
    statusCode = 400;
  } else if (error.name === "StrictModeError") {
    message = `The field "${error.path}" is not allowed. Please remove it and try again.`;
    statusCode = 400;
  } else if (error.name === "DocumentNotFoundError") {
    message = "The requested document was not found. Please check the ID and try again.";
    statusCode = 404;
  } else if (error.name === "MulterError"){
    if(error.message === "Unexpected field"){
      message = "Unable to upload image. Please check the name and try again."
      statusCode = 400;
    }else{
      message = "Unable to upload the image."
      statusCode = 500;
    }
  }
   console.log("Unknown error.", error.name);
  responseClient({ req, res, statusCode, message });
};
