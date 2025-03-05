import Joi from "joi";
import { validateData } from "./joiValidation.js";

export const validateBookID = (req, res, next) => {
  const obj = {
    id: Joi.string().required(),
  };
  return validateData({ req, res, next, obj, source:'params' });
};

export const validateBook = (req, res, next) => {
  const obj = {
    title: Joi.string().min(3).required(),
    year: Joi.number().min(9).required(),
    bookImage: Joi.object(),
    isbn: Joi.string().pattern(/^\d{10}$|^\d{13}$/).messages({
      "string.pattern.base": "ISBN is not in valid format."
    }),
    genre: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
  };
  return validateData({ req, res, next, obj });
};

export const validateUpdateBook = (req, res, next) => {
   req.body.expectedAvailabilityDate = req.body.expectedAvailabilityDate === "null" ? null : req.body.expectedAvailabilityDate;
  const obj = {
    title: Joi.string().min(3).required(),
    year: Joi.number().min(9).required(),
    genre: Joi.string().required(),
    imageURL: Joi.string().allow(""),
    imageList:Joi.array().allow(""),
    author: Joi.string().required(),
    description: Joi.string().required(),
    expectedAvailabilityDate: Joi.date().allow(null, ""),
    status: Joi.string().valid("active","inactive").required(),
    bookImage:Joi.array(),
  };
  return validateData({ req, res, next, obj });
};