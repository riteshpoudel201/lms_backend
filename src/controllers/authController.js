import { responseClient } from "../middlewares/responseClient.js";
import { createNewUser } from "../models/user/userModel.js";
import { hashPassword } from "../utils/bcrypt.js";

export const insertNewUser = async (req, res, next) => {
  try {
    console.log(req.body);
    //implement signup process here
    //receive user data
    const { password } = req.body;
    // encrypt the password
    const hashedPassword = hashPassword(password);
    req.body.password = hashedPassword;
    //insert user in db

    const user = await createNewUser(req.body);
    if (user?._id) {
      //generate unique activation link and send to the user to be inserted
      
      const message = " We have sent you an email with the account activation link. Please follow that to activate your account."
      return responseClient({req, res, message});
    }
    throw new Error(
      "Unable to create an account at the moment. Please try again later."
    );
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.message =
        "The provided email address is already in use. Please try another.";
    }
    error.statusCode = 400;
    next(error);
  }
};
