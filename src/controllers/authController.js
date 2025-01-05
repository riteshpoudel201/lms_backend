import { responseClient } from "../middlewares/responseClient.js";
import { createNewSession } from "../models/session/sessionModel.js";
import { createNewUser } from "../models/user/userModel.js";
import { userActivationLink } from "../services/email/emailService.js";
import { hashPassword } from "../utils/bcrypt.js";
import { v4 as uuid } from "uuid";

export const insertNewUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = hashPassword(password);
    req.body.password = hashedPassword;
    
    const user = await createNewUser(req.body);
    if (!user?._id)
      throw new Error(
        "Unable to create an account at the moment. Please try again later."
      );

    //generate unique user activation link and send to the user via email
    const session = await createNewSession({
      token: uuid(),
      association: user?.email,
    });
    if (!session?._id)
      throw new Error("Session creation failed. Please try again later");

    const url = `${process.env.FRONTEND_URL}/activate-user?sessionId=${session._id}&t=${session.token}`;
    const emailId = await userActivationLink({
      email: user.email,
      url,
      name: user.firstName,
    });
    if (!emailId)
      throw new Error(
        "Unable to send activation link. Please try again later."
      );

    const message =
      " We have sent you an email with the account activation link. Please follow that to activate your account.";
    return responseClient({ req, res, message });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.message =
        "The provided email address is already in use. Please try another.";
    }
    error.statusCode = 400;
    next(error);
  }
};
