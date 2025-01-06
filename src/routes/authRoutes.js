import express from "express";
import { activateUser, insertNewUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", insertNewUser);
router.post("/activate-user", activateUser);

export default router;
