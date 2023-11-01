import { Router } from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createPostComment,
  likeCountUp,
} from "../controllers/postController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(getPosts).post(protect, createPost);

router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);
router.route("/:id/comments").post(createPostComment);
router.route("/:id/likecount").put(likeCountUp);

export default router;
