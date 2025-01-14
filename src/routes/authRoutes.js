import express from "express";
import { activateUser, insertNewUser, loginUser, logoutUser } from "../controllers/authController.js";
import { validateUser, validateUserActivationData, validateUserLoginData } from "../middlewares/validation/authValidation.js";
import { renewJwtMiddleware, userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",validateUser, insertNewUser);
router.post("/activate-user",validateUserActivationData, activateUser);
router.post("/login", validateUserLoginData, loginUser)
router.get("/renew-jwt", renewJwtMiddleware)
router.get("/logout",userAuthMiddleware, logoutUser)

export default router;
