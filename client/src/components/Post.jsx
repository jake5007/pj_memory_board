import { useState } from "react";
import { Card } from "react-bootstrap";
import {
  BsHeartFill,
  BsHeart,
  BsTrashFill,
  BsArrowsAngleExpand,
} from "react-icons/bs";
import { AiFillEdit, AiOutlineComment } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import { OverlayLoader, PostEditModal, PostExpandedModal } from "./";
import {
  useGetPostsQuery,
  useDeletePostMutation,
  useLikeCountUpMutation,
} from "../slices/postsApiSlice";

const Post = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const [likeCountUp, { isLoading: loadingLike }] = useLikeCountUpMutation();
  const [deletePost, { isLoading: loadingDelete }] = useDeletePostMutation();
  const { refetch } = useGetPostsQuery();

  const handleLikeCountUp = async (id) => {
    if (!userInfo) {
      toast.error("You have to log in first");
      return;
    }

    try {
      const { message } = await likeCountUp(id).unwrap();
      refetch();
      toast.success(message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        refetch();
        toast.success("Post deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Card className="w-100 my-3 shadow position-relative">
      {/* loading while liking */}
      {loadingLike && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 10,
          }}
        >
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}
      <Card.Img
        variant="top"
        src={post.image}
        alt="image"
        className="post-image"
      />
      <Card.ImgOverlay className="text-white" style={{ pointerEvents: "none" }}>
        <div className="d-flex justify-content-between">
          <Card.Title className="text-capitalize">{post.user.name}</Card.Title>
          <div
            role="button"
            onClick={() => setIsExpanded(true)}
            style={{ pointerEvents: "auto", zIndex: 1 }}
          >
            <BsArrowsAngleExpand size={18} className="hover-icon" />
          </div>
        </div>
        <Card.Text>{moment(post.createdAt).fromNow()}</Card.Text>
      </Card.ImgOverlay>

      <Card.Body>
        <Card.Title
          className="hover-underline"
          onClick={() => setIsExpanded(true)}
        >
          {post.title}
        </Card.Title>
        <Card.Subtitle className="my-3 text-secondary fst-italic">
          {post?.tags.map((tag, idx) =>
            idx + 1 === post.tags.length ? `#${tag}` : `#${tag} `
          )}
        </Card.Subtitle>
        <Card.Text>{post.content}</Card.Text>
      </Card.Body>

      <div
        className="d-flex justify-content-between mb-3 mx-3"
        style={{
          color: "red",
        }}
      >
        <div
          className={`
            d-flex 
            gap-3
          
            ${
              userInfo && userInfo._id === post.user._id
                ? ""
                : "w-100 justify-content-between"
            } 
          `}
        >
          <div
            role="button"
            style={{
              zIndex: "1",
              pointerEvents: loadingLike ? "none" : "auto",
              opacity: loadingLike ? 0.6 : 1,
              cursor: loadingLike ? "not-allowed" : "pointer",
            }}
            onClick={() => !loadingLike && handleLikeCountUp(post._id)}
          >
            {post?.likedBy.includes(userInfo?._id) ? (
              <BsHeartFill />
            ) : (
              <BsHeart />
            )}{" "}
            {post.likeCount}
          </div>
          <div className="text-dark-emphasis">
            <AiOutlineComment />
            {` ${post.numComments}`}
          </div>
        </div>

        {userInfo && userInfo._id === post.user._id && (
          <div className="d-flex gap-3">
            <div
              role="button"
              style={{ color: "blue", zIndex: "1" }}
              onClick={() => setIsOpen(true)}
            >
              <AiFillEdit /> Edit
            </div>
            <div
              role="button"
              style={{ zIndex: "1" }}
              onClick={() => handleDelete(post._id)}
            >
              <BsTrashFill /> Delete
            </div>
          </div>
        )}
      </div>
      {loadingDelete && <OverlayLoader />}
      <PostEditModal
        post={post}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
      <PostExpandedModal
        post={post}
        isExpanded={isExpanded}
        closeModal={() => setIsExpanded(false)}
      />
    </Card>
  );
};
export default Post;
