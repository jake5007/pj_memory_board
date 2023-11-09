import { Router } from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.put("/profile", protect, updateUserProfile);

export default router;
