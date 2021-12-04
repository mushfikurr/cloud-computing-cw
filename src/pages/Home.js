import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import GoogleLogin from "react-google-login";
import RecentPosts from "../components/RecentPosts";
import { AppBarAuthed } from "../components/AppBar";
import NavBar from "../components/NavBar";
import { Box, Toolbar, Typography, AppBar, Button } from "@mui/material";

export default function Home() {
  const { isAuthenticated, login } = useContext(UserContext);
  const onSuccess = (response) => {
    console.log(response.tokenId);
    login(response.tokenId);
  };

  const onFailure = (response) => {
    console.log("Failure");
  };

  return isAuthenticated() ? (
    <>
      <AppBarAuthed />
      <NavBar />
      <RecentPosts />
    </>
  ) : (
    <>
      <h1>Not authenticated</h1>
      <GoogleLogin
        clientId="1084294817544-vcbqovejip9q2drlfaoke9kr6je0akqj.apps.googleusercontent.com"
        render={(renderProps) => (
          <Button color="warning" onClick={renderProps.onClick}>
            Login
          </Button>
        )}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}
