import { Router } from "express";
import {
  authUser,
  registerUser,
  logoutUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

export default router;
