import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Post, Loader, Message, PostModal } from "../components";
import { useGetPostsQuery } from "../slices/postsApiSlice";

const HomeScreen = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetPostsQuery();

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Latest Posts</h2>
        {userInfo && (
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            + New
          </Button>
        )}
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <Row>
            {data.map((post) => (
              <Col
                sm={12}
                md={6}
                lg={4}
                xl={3}
                key={post._id}
                className="d-flex align-items-stretch"
              >
                <Post post={post} />
              </Col>
            ))}
          </Row>
        </>
      )}
      <PostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
};
export default HomeScreen;
