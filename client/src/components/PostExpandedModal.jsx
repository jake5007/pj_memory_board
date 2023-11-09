import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Modal,
  Row,
  Col,
  Image,
  Form,
  ListGroup,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetPostsQuery,
  useCreatePostCommentMutation,
} from "../slices/postsApiSlice";
import { Loader, Message } from "./";

const getCommentTime = (createdTime) => {
  const date = new Date(createdTime);

  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");

  const time = `${hours}:${mins}`;

  return time;
};

const PostExpandedModal = ({ post, isExpanded, closeModal }) => {
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const { refetch } = useGetPostsQuery();
  const [createComment, { isLoading: loadingComment }] =
    useCreatePostCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createComment({
        postId: post._id,
        comment,
      }).unwrap();

      refetch();
      toast.success("Comment added");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal
      show={isExpanded}
      onHide={closeModal}
      size="lg"
      backdrop="static"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>{post.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Image src={post.image} fluid />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 12, order: 2 }} sm={{ span: 6, order: 1 }}>
              <h5 className="text-capitalize mt-3 mb-0">{post.user.name}</h5>
              <span className="text-secondary">{post.user.email}</span>
            </Col>
            <Col xs={{ span: 12, order: 1 }} sm={{ span: 6, order: 2 }}>
              <span className="d-block mt-1 text-sm-end">
                created at: {post.createdAt.substring(0, 10)}
              </span>
            </Col>
          </Row>
          <Row className="mt-2 text-secondary fst-italic">
            <Col>
              {post?.tags.map((tag, idx) => (
                <span key={idx}>
                  {idx + 1 === post.tags.length ? `#${tag}` : `#${tag} `}
                </span>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="my-3">{post.content}</p>
            </Col>
          </Row>

          {/* comment section */}
          <Row className="comment">
            <Col>
              <h3>Comments</h3>
              {loadingComment && <Loader />}
              {userInfo ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="comment" className="my-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Write something..."
                      rows={4}
                      style={{ resize: "none" }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingComment}
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">login</Link> first to write a comment
                </Message>
              )}
              <section className="my-3">
                {post.comments.length === 0 && <Message>No comments</Message>}
                <ListGroup variant="flush">
                  {post.comments.map((comment) => (
                    <ListGroup.Item key={comment._id}>
                      <span>
                        <strong>{comment.name}</strong>{" "}
                        <span className="text-secondary">
                          {comment.createdAt.substring(0, 10)}{" "}
                          {getCommentTime(comment.createdAt)}
                        </span>
                      </span>
                      <p>
                        <span
                          className="text-secondary"
                          style={{
                            fontSize: "0.85em",
                          }}
                        >
                          {comment.user.email}
                        </span>
                      </p>
                      <p>{comment.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </section>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default PostExpandedModal;
