import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="error-section ">
      <h2>402</h2>
      <p className="error-paragraph">page not found</p>
      <Link to="/" className="link-primary go-back-link">
        Back Home
      </Link>
    </section>
  );
};
export default Error;
