import { responseClient } from "../middlewares/responseClient.js";
import {
  createNewSession,
  deleteManySession,
  deleteSession,
} from "../models/session/sessionModel.js";
import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/user/userModel.js";
import { userActivationLink } from "../services/email/emailService.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { v4 as uuid } from "uuid";
import { getJwts } from "../utils/jwt.js";

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

export const activateUser = async (req, res, next) => {
  try {
    const { sessionId, t } = req.body;

    const session = await deleteSession({
      _id: sessionId,
      token: t,
    });
    if (session?._id) {
      // update user status
      const user = await updateUser(
        { email: session?.association },
        { isActivated: true }
      );
      if (user?._id) {
        const url = `${process.env.FRONTEND_URL}/signin`;
        const emailId = await userActivationLink({
          email: user.email,
          url,
          name: user.firstName,
        });
        if (emailId) {
          const message =
            "User has been successfully activated. Please proceed to login.";
          return responseClient({ req, res, message });
        }
      }
    }
    const msg = "Invalid link or token has expired.";

    return responseClient({ req, res, message: msg, statusCode: 400 });
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Credentials: ", email);

    //get user by email
    const user = await getUserByEmail(email);
    //compare password
    if (!user?.id) throw new Error("Invalid email or password.");

    const isPasswordValid = comparePassword(password, user?.password);
    if (!isPasswordValid) throw new Error("Invalid email or password.");

    //create jwt
    const jwts = await getJwts(email);
    //response jwt
    return responseClient({
      req,
      res,
      message: "Logged in successfully.",
      data: jwts,
    });
  } catch (error) {
    if (error.message.includes("Invalid email")) {
      error.statusCode = 401;
    }
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    // Get the user email
    const { email } = req.userInfo;

    // Update the refresh token
    const user = await updateUser({ email }, { refreshJwt: "" });
    if (!user) {
      return responseClient({
        req,
        res,
        message: "Unable to logout. User not found.",
        statusCode: 404,
      });
    }

    // Delete all associated sessions
    const sessionResult = await deleteManySession({ association: user.email });

    // Check if sessions were deleted successfully
    if (sessionResult?.deletedCount > 0) {
      return responseClient({
        req,
        res,
        message: "User logged out successfully.",
        statusCode: 200,
      });
    }

    // If no sessions were deleted
    return responseClient({
      req,
      res,
      message: "No sessions found for this user.",
      statusCode: 400,
    });
  } catch (error) {
    // Handle specific error scenarios
    if (error.message.includes("Invalid email")) {
      return responseClient({
        req,
        res,
        message: "Invalid email provided.",
        statusCode: 401,
      });
    }

    // Propagate other errors
    next(error);
  }
};

