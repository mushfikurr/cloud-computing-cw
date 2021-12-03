import { Link } from "react-router-dom";

export default function NotAuthenticated() {
  return (
    <h1>
      You are not logged in. <Link to="/">Log in here.</Link>
    </h1>
  );
}
