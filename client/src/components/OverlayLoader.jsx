import {
  ClimbingBoxLoader,
  ClipLoader,
  FadeLoader,
  CircleLoader,
  PuffLoader,
} from "react-spinners";

const loaderMap = {
  ClimbingBoxLoader,
  ClipLoader,
  FadeLoader,
  CircleLoader,
  PuffLoader,
};

const Loader = ({
  type = "ClipLoader",
  size = 100,
  color = "#fff",
  backdrop = true,
  speedMultiplier = 1,
}) => {
  const LoaderComponent = loaderMap[type] || ClipLoader;

  const loader = (
    <LoaderComponent
      size={size}
      color={color}
      speedMultiplier={speedMultiplier}
    />
  );

  if (!backdrop) {
    return (
      <div
        style={{
          display: "flex",
          jusityContent: "center",
          margin: "1rem 0",
        }}
      >
        {loader}
      </div>
    );
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex 
      justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
      }}
    >
      {loader}
    </div>
  );
};
export default Loader;
