import { responseClient } from "../middlewares/responseClient.js";

export const getUserProfile = async (req, res, next) => {
  const { password, __v, refreshJwt, ...rest } = req.userInfo;
  return responseClient({
    req,
    res,
    message: "User fetched successfully.",
    data: rest,
  });
};
