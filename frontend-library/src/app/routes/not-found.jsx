import { Link } from "react-router-dom";

export const NotFoundRoute = () => {
  return (
    <div>
      <h1>404 - Not found</h1>
      <p>Sorry, the page you are looking for does not exisrt</p>
      <Link to="/" replace>
        Go to Home
      </Link>
    </div>
  );
};
