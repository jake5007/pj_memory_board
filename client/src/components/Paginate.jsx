import { LinkContainer } from "react-router-bootstrap";
import { Pagination } from "react-bootstrap";

const Paginate = ({ pages, currPage }) => {
  console.log("currPage -- ", currPage);
  console.log("pages --- ", pages);

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((n) => (
          <LinkContainer key={n + 1} to={`/page/${n + 1}`}>
            <Pagination.Item active={n + 1 === currPage}>
              {n + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};
export default Paginate;
