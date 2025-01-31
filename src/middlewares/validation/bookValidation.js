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
    imageURL: Joi.string().email({ minDomainSegments: 2 }).required(),
    isbn: Joi.string().pattern(/^\d{10}$|^\d{13}$/).messages({
      "string.pattern.base": "ISBN is not in valid format."
    }),
    genre: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
  };
  return validateData({ req, res, next, obj });
};