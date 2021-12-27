import { UserContext } from "../utils/UserProvider";
import { useContext, useEffect } from "react";
import NotAuthenticated from "../pages/NotAuthenticated";
import { useNavigate } from "react-router";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return isAuthenticated() === true ? children : <NotAuthenticated />;
}
