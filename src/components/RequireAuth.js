import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import NotAuthenticated from "../pages/NotAuthenticated";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated === true ? children : <NotAuthenticated />;
}
