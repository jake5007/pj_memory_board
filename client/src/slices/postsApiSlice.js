import { POSTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: POSTS_URL,
      }),
      providesTags: ["Post"],
      keepUnusedDataFor: 5,
    }),
    uploadPostImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: POSTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}`,
        method: "DELETE",
      }),
    }),
    createPostComment: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    likeCountUp: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}/likecount`,
        method: "PUT",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useUploadPostImageMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreatePostCommentMutation,
  useLikeCountUpMutation,
} = postsApiSlice;
