import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Go to home</Link>
    </div>
  );
};

export default NotFound;
