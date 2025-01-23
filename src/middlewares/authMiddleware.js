import { responseClient } from "../middlewares/responseClient.js";
import { getSession } from "../models/session/sessionModel.js";
import {
  getOneUser,
  getUserByEmail,
  updateUser,
} from "../models/user/userModel.js";
import { verifyAccessJwt, verifyRefreshJwt } from "../utils/jwt.js";
import { createAccessJwt } from "../utils/jwt.js";

// Helper to handle responses
const sendErrorResponse = (req, res, message, statusCode = 400) => {
  return responseClient({ req, res, message, statusCode });
};

// Helper to verify token and return decoded payload
const verifyToken = async (req, token, res) => {
  try {
    return await verifyAccessJwt(token);
  } catch {
    sendErrorResponse(req, res, "Invalid or expired token.", 401);
    return null; // Return null if token verification fails
  }
};

// Helper to get session or return an error
const fetchSession = async (req, token, res) => {
  try {
    const session = await getSession({ token });
    if (!session?._id) {
      sendErrorResponse(req, res, "User session is unavailable.", 401);
      return null;
    }
    return session;
  } catch (error) {
    sendErrorResponse(req, res, "Error retrieving session.", 500);
    return null;
  }
};

// Helper to get user by email and check activation
const fetchActivatedUser = async (req, email, res) => {
  try {
    const user = await getUserByEmail(email);
    if (user?._id && user?.isActivated) {
      return user;
    }
    sendErrorResponse(
      req,
      res,
      "User is either not activated or unavailable.",
      400
    );
    return null;
  } catch (error) {
    sendErrorResponse(req, res, "Error fetching user details.", 500);
    return null;
  }
};

// Main middleware
export const userAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return sendErrorResponse(
      req,
      res,
      "Unauthorized access. Missing authorization header.",
      401
    );
  }

  const token = authorization.split(" ")[1];
  const decoded = await verifyToken(req, token, res);

  if (!decoded?.email) {
    return; // Error already handled in verifyToken
  }

  const session = await fetchSession(req, token, res);
  if (!session) return;

  const user = await fetchActivatedUser(req, session?.association, res);
  if (!user) return;

  const { password, isActivated, createdAt, updatedAt, ...rest } =
    (req.userInfo = user.toObject() ?? {});

  return next();
};

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    req.userInfo.role === "admin"
    ? next()
    : responseClient({
        req,
        res,
        message: "You don't have access to this resource.",
        statusCode: 403,
      });
  } catch (error) {
    next(error);
  }
  
};

export const renewJwtMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("Unauthorized access.");
  const token = authorization.split(" ")[1];

  const decoded = await verifyRefreshJwt(token);
  if (!decoded.email) throw new Error("Unauthorized access.");

  const user = await getOneUser({ email: decoded.email, refreshJwt: token });
  if (!user._id) throw new Error("User is unavailable.");

  //create new accessJwt
  const accessJwt = await createAccessJwt(user?.email);
  if (accessJwt) {
    return responseClient({
      req,
      res,
      message: "Access token generated.",
      statusCode: 200,
      data: accessJwt,
    });
  }
  //return accessJwt

  //if all check have passed, just return the message saying user isn't activated
  return responseClient({
    req,
    res,
    message: "Unauthorized",
    statusCode: 401,
  });
};
