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

router
  .route("/:id")
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.route("/:id/comments").post(createPostComment);
router.route("/:id/likecount").put(protect, likeCountUp);

export default router;
