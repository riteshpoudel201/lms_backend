import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";
// import { validateUser, validateUserActivationData, validateUserLoginData } from "../middlewares/validation/userValidation.js";

const router = express.Router();

router.get("/profile",userAuthMiddleware ,getUserProfile);


export default router;
