import { responseClient } from "./responseClient.js";

export const errorHanlder = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  responseClient({ req, res, statusCode, message: error.message });
};
