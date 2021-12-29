import { createContext, useEffect, useState, ReactDOM } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const UserContext = createContext();
const HOST_URL = "localhost:3000";

const UserProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentUser, setCurrentUser] = useState({
    id: "",
    email: "",
    picture: "",
    givenName: "",
    familyName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    axios(config)
      .then(function (response) {
        loadUser();
        setIsLoading(false);
        enqueueSnackbar("Logged in successfully.", {
          autoHideDuration: 1500,
          resumeHideDuration: 0,
          variant: 'Success',
        });
      })
      .catch(function (error) {
        setIsLoading(false);
        enqueueSnackbar("Unable to login successfully.", {
          autoHideDuration: 1500,
          resumeHideDuration: 0,
          variant: 'Error',
        });
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

    setIsLoading(true);
    axios(config)
      .then(function (response) {
        setCurrentUser({});
        setIsLoading(false);
        enqueueSnackbar("Logged out successfully.", {
          autoHideDuration: 1500,
          resumeHideDuration: 0,
          variant: 'Success',
        });
      })
      .catch(function (error) {
        setIsLoading(false);
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
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        loadUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
