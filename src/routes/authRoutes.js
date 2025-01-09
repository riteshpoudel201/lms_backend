import express from "express";
import { activateUser, insertNewUser, loginUser } from "../controllers/authController.js";
import { validateUser, validateUserActivationData, validateUserLoginData } from "../middlewares/validation/authValidation.js";

const router = express.Router();

router.post("/register",validateUser, insertNewUser);
router.post("/activate-user",validateUserActivationData, activateUser);
router.post("/login", validateUserLoginData, loginUser)

export default router;
