import express from "express";
import { activateUser, insertNewUser, loginUser, logoutUser, requestOTP, resetPassword } from "../controllers/authController.js";
import { validateRequestOtpData, validateResetPasswordData, validateUser, validateUserActivationData, validateUserLoginData } from "../middlewares/validation/authValidation.js";
import { renewJwtMiddleware, userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",validateUser, insertNewUser);
router.post("/activate-user",validateUserActivationData, activateUser);

router.post("/login", validateUserLoginData, loginUser)

router.post("/request-otp", validateRequestOtpData, requestOTP)
router.post("/reset-password", validateResetPasswordData, resetPassword)

router.get("/renew-jwt", renewJwtMiddleware)
router.get("/logout",userAuthMiddleware, logoutUser)


export default router;
