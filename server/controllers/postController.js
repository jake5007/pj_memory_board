import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/PostModel.js";

// @desc Get all public posts
// @routes GET /api/posts
// @access Public
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("user", "name");

  res.status(200).json(posts);
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
export const updatePost = (req, res) => {
  res.send("update post");
};

// @desc Delete a post
// @routes DELETE /api/posts/:id
// @access Private
export const deletePost = (req, res) => {
  res.send("delete post");
};

// @desc Create a post comment
// @routes POST /api/posts/:id/comments
// @access Public
export const createPostComment = (req, res) => {
  res.send("create post comment");
};

// @desc like count up
// @routes PUT /api/posts/:id/likeCount
// @access Private
export const likeCountUp = (req, res) => {
  res.send("Like count up");
};
