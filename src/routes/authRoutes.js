import express from "express";
import { activateUser, insertNewUser } from "../controllers/authController.js";
import { validateUser, validateUserActivationData } from "../middlewares/validation/authValidation.js";

const router = express.Router();

router.post("/register",validateUser, insertNewUser);
router.post("/activate-user",validateUserActivationData, activateUser);

export default router;
