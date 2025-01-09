import { responseClient } from "../middlewares/responseClient.js";
import { getSession } from "../models/session/sessionModel.js";
import { getUserByEmail } from "../models/user/userModel.js";
import { verifyAccessJwt } from "../utils/jwt.js";
export const userAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("Unauthorized access.");
  const token = authorization.split(" ")[1];

  const decoded = await verifyAccessJwt(token);
  const message = decoded === "jwt expired" ? decoded : "Unauthorized access.";
  if (!decoded.email) throw new Error(message);

  const session = await getSession({ token });
  if (!session._id) throw new Error("User is unavailable.");

  const user = await getUserByEmail(session?.association);

  //enter here only if user is activated
  if (user?._id && user?.isActivated) {
    const { password, role, isActivated, createdAt, updatedAt, ...rest } =
      req.userInfo = user.toObject() ?? {};
    return next();
  }

  //if all check have passed, just return the message saying user isn't activated
  return responseClient({
    req,
    res,
    message: "User is either not activated or unavailable.",
    statusCode: 400,
  });
};
