import { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Post, Loader, Message, PostModal } from "../components";
import { useGetPostsQuery } from "../slices/postsApiSlice";

const HomeScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const { data, isLoading, error } = useGetPostsQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setFilteredPosts(data);
  }, [data]);

  const handleChange = (e) => {
    const visibility = e.target.value;

    if (visibility === "public") {
      setFilteredPosts(data.filter((post) => post.isPrivate === false));
    } else if (visibility === "private") {
      console.log(userInfo._id.toString());
      setFilteredPosts(
        data.filter(
          (post) =>
            post.isPrivate === true &&
            post.user._id.toString() === userInfo._id.toString()
        )
      );
    } else {
      setFilteredPosts(data);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Latest Posts</h2>
        {userInfo && (
          <div className="d-flex gap-3">
            <Form.Select onChange={handleChange}>
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
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <Row>
            {filteredPosts?.map((post) => (
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
