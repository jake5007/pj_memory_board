import { useEffect, useState } from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import { OverlayLoader } from ".";
import {
  useGetPostsQuery,
  useUploadPostImageMutation,
  useUpdatePostMutation,
} from "../slices/postsApiSlice";

import "react-tagsinput/react-tagsinput.css";

const PostEditModal = ({ post, isOpen, closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);

  const { refetch } = useGetPostsQuery();
  const [uploadPostImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();
  const [updatePost, { isLoading: loadingUpdate }] = useUpdatePostMutation();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImage(post.image);
      setTags(post.tags);
      setIsPrivate(post.isPrivate);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to edit this post?")) {
      try {
        await updatePost({
          postId: post._id,
          title,
          content,
          image,
          tags,
          isPrivate,
        }).unwrap();

        toast.success("Post updated");
        refetch();
        closeModal();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
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

  if (!post) return null;

  return (
    <Modal show={isOpen} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
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
              {loadingUpload && <OverlayLoader />}

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
            Edit
          </Button>
        </Modal.Footer>
      </Form>
      {loadingUpdate && <OverlayLoader />}
    </Modal>
  );
};

export default PostEditModal;
