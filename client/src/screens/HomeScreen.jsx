import { useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  Post,
  OverlayLoader,
  Message,
  PostModal,
  Paginate,
} from "../components";
import { useGetPostsQuery } from "../slices/postsApiSlice";

const HomeScreen = () => {
  const { pageNum } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [visibility, setVisibility] = useState("all");

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const { data, isLoading, error } = useGetPostsQuery({
    visibility: visibility || "all",
    pageNum,
    userId,
  });

  return (
    <main>
      <div className="d-flex justify-content-between">
        <h2>Latest Posts</h2>
        {userInfo && (
          <div className="d-flex gap-3">
            <Form.Select onChange={(e) => setVisibility(e.target.value)}>
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Form.Select>

            <Button
              className="text-nowrap"
              variant="primary"
              onClick={() => setIsOpen(true)}
            >
              + New
            </Button>
          </div>
        )}
      </div>
      {isLoading ? (
        <OverlayLoader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <Row>
            {data?.posts.map((post) => (
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
          <Paginate pages={data.pages} currPage={data.page} />
        </>
      )}
      <PostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </main>
  );
};
export default HomeScreen;
