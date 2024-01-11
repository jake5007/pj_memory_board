import { Types } from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/PostModel.js";

// @desc Get all public posts
// @routes GET /api/posts
// @access Public
export const getPosts = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const visibility = req.query.visibility;
  const docCond =
    visibility === "public"
      ? { isPrivate: false }
      : visibility === "private"
      ? { user: new Types.ObjectId(userId), isPrivate: true }
      : { $or: [{ isPrivate: false }, { user: userId, isPrivate: true }] };

  const pageSize = 4;
  const page = Number(req.query.pageNum) || 1;

  const count = await Post.countDocuments(docCond);

  const posts = await Post.find(docCond)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "name email")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "email",
      },
    });

  res.status(200).json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc Get a post by id
// @routes GET /api/posts/:id
// @access Public
export const getPostById = asyncHandler(async (req, res) => {
  res.send("get post by id");
});

// @desc Create a post
// @routes POST /api/posts
// @access Private
export const createPost = asyncHandler(async (req, res) => {
  const { title, tags, content, image, isPrivate } = req.body;

  const post = new Post({
    user: req.user._id,
    title,
    tags,
    content,
    image,
    likeCount: 0,
    numComments: 0,
    isPrivate,
  });

  const createdPost = await post.save();

  res.status(201).json(createdPost);
});

// @desc Update a post
// @routes PUT /api/posts/:id
// @access Private
export const updatePost = asyncHandler(async (req, res) => {
  const { title, tags, content, image, isPrivate } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.title = title;
    post.tags = tags;
    post.content = content;
    post.image = image;
    post.isPrivate = isPrivate;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Delete a post
// @routes DELETE /api/posts/:id
// @access Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    await Post.deleteOne({ _id: post._id });

    res.status(200).json({ message: "Post deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc Create a post comment
// @routes POST /api/posts/:id/comments
// @access Private
export const createPostComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    const postComment = {
      user: req.user._id,
      name: req.user.name,
      comment,
    };

    post.comments.push(postComment);
    post.numComments = post.comments.length;

    await post.save();

    res.status(201).json({ message: "Comment added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

{
  /* Update comment, delete comment */
}

// @desc like count up
// @routes PUT /api/posts/:id/likeCount
// @access Private
export const likeCountUp = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  let message;

  {
    /* instead of adding count directly, how about setting likeCount using likedBy.length ?*/
  }
  if (post) {
    if (post?.likedBy && post.likedBy.includes(req.user._id)) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      message = "You've unliked this post.";
    } else {
      post.likedBy.push(req.user._id);
      message = "You've liked this post.";
    }
    post.likeCount = post.likedBy.length;

    const updatedPost = await post.save();

    res.status(200).json({ message, updatedPost });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});
