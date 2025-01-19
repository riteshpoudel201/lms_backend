import Joi from "joi";
import { validateData } from "./joiValidation.js";

export const validateUser = (req, res, next) => {
  const obj = {
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    phone: Joi.number().min(9).optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  };
  return validateData({ req, res, next, obj });
};
export const validateUserActivationData = (req, res, next) => {
  const obj = {
    sessionId: Joi.string().min(10).max(50).required(),
    t: Joi.string().min(10).max(50).required(),
  };
  return validateData({ req, res, next, obj });
};
export const validateUserLoginData = (req, res, next) => {
  const obj = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  };
  return validateData({ req, res, next, obj });
};
export const validateRequestOtpData = (req, res, next) => {
  const obj = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  };
  return validateData({ req, res, next, obj });
};
export const validateResetPasswordData = (req, res, next) => {
  const obj = {
    otp: Joi.number().required(),
    password: Joi.string().required(),
  };
  return validateData({ req, res, next, obj });
};