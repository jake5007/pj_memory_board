import { useState } from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import { Loader } from "./";
import {
  useGetPostsQuery,
  useUploadPostImageMutation,
  useCreatePostMutation,
} from "../slices/postsApiSlice";

import "react-tagsinput/react-tagsinput.css";

const PostModal = ({ isOpen, closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);

  const { data: posts, isLoading, error, refetch } = useGetPostsQuery();
  const [uploadPostImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();
  const [createPost, { isLoading: loadingCreate }] = useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPost({
        title,
        content,
        image,
        tags,
        isPrivate,
      }).unwrap();

      toast.success("Post created");
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadPostImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal show={isOpen} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Form.Group controlId="title" className="my-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="tags" className="my-3">
              <Form.Label>Tags (up to 3)</Form.Label>
              <Form.Control
                as={TagsInput}
                maxTags="3"
                onlyUnique
                value={tags}
                onChange={(inputTags) => setTags(inputTags)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="content" className="my-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter something..."
                style={{ resize: "none" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                label="Choose file"
                onChange={handleFileUpload}
              ></Form.Control>
              {loadingUpload && <Loader />}

              <Form.Group controlId="isPrivate" className="my-4">
                <Form.Check
                  type="switch"
                  label="Private"
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              </Form.Group>
            </Form.Group>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PostModal;
