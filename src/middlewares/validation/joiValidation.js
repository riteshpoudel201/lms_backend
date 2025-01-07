import Joi from "joi";
import { responseClient } from "../responseClient.js";
export const validateData = ({ req, res, next, obj }) => {
  //creating schema for validation purpose
  const schema = Joi.object(obj);

  //validating the incoming data using the schema
  const value = schema.validate(req.body);
  if (value.error) {
    return responseClient({
      req,
      res,
      message: value.error.message,
      statusCode: 400,
    });
  }
  next();
};


