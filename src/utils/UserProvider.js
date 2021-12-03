import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();
const HOST_URL = "localhost:3000";

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: "",
    email: "",
    picture: "",
    givenName: "",
    familyName: "",
  });

  useEffect(() => {
    console.log(isAuthenticated());
  }, [currentUser]);

  const login = (tokenId) => {
    var data = new FormData();
    data.append("token_id", tokenId);
    var config = {
      method: "post",
      url: "/api/login",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        loadUser();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logout = () => {
    var config = {
      method: "get",
      url: "/api/logout",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    axios(config)
      .then(function (response) {
        setCurrentUser({});
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const isAuthenticated = () => {
    if (Object.keys(currentUser).length === 0) {
      return false;
    }
    return true;
  };

  const loadUser = () => {
    var config = {
      method: "get",
      url: "/api/data",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    axios(config)
      .then((response) => {
        const data = response.data;
        setCurrentUser({
          id: data.id,
          email: data.email,
          picture: data.picture,
          givenName: data.given_name,
          familyName: data.family_name,
        });
      })
      .catch((error) => {
        console.log(error);
        setCurrentUser({});
      });
  };

  return (
    <UserContext.Provider
      value={{ currentUser, isAuthenticated, loadUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
