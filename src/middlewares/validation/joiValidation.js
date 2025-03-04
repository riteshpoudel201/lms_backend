import Joi from "joi";
import { responseClient } from "../responseClient.js";
import { deleteUploadedFiles } from "../../utils/fileUtils.js";
export const validateData = ({ req, res, next, obj, source }) => {
  //creating schema for validation purpose
  const schema = Joi.object(obj);

  //validating the incoming data using the schema
  const value = schema.validate(req[source] || req.body);
  if (value.error) {
    console.log("Just outside the check.");
    if(req.file || Array.isArray(req.files)){
      deleteUploadedFiles(req);
    }
    return responseClient({
      req,
      res,
      message: value.error.message,
      statusCode: 400,
    });
  }
  next();
};


