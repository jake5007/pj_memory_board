import { Card, Image } from "react-bootstrap";
import { BsHeartFill, BsTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import moment from "moment";

const Post = ({ post }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Card className="my-3 shadow">
      <Card.Img
        variant="top"
        src={post.image}
        alt="image"
        className="post-image"
      />
      <Card.ImgOverlay className="text-white">
        <Card.Title className="text-capitalize">{post.user.name}</Card.Title>
        <Card.Text>{moment(post.createdAt).fromNow()}</Card.Text>
      </Card.ImgOverlay>

      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="my-3 text-secondary fst-italic">
          {post?.tags?.map((tag, idx) =>
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
        <div style={{ cursor: "pointer", zIndex: "1" }}>
          <BsHeartFill /> {post.likeCount}
        </div>
        {userInfo && userInfo._id === post.user._id && (
          <div style={{ cursor: "pointer", zIndex: "1" }}>
            <BsTrashFill /> Delete
          </div>
        )}
      </div>
    </Card>
  );
};
export default Post;
