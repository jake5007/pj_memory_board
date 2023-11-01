import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      variant="secondary"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        display: "block",
        margin: "auto",
      }}
    />
  );
};
export default Loader;
