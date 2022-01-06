import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  AppBar,
  Button,
} from "@mui/material";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";

const renderRightSide = (props) => {
  const onSuccess = (response) => {
    props.login(response.tokenId);
    console.log(response.tokenId);
  };


  return props.isAuthenticated() ? (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          props.logout();
        }}
      >
        Logout
      </Button>
      <Tooltip title="Open settings">
        <IconButton>
          <Avatar alt={props.fullName} src={props.picture} />
        </IconButton>
      </Tooltip>
    </>
  ) : (
    <GoogleLogin
      clientId="1084294817544-vcbqovejip9q2drlfaoke9kr6je0akqj.apps.googleusercontent.com"
      render={(renderProps) => (
        <Button variant="outlined" onClick={renderProps.onClick}>
          Login
        </Button>
      )}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={(response) => {console.log(response)}}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export const UserAppBar = () => {
  const { currentUser, login, logout, isAuthenticated } =
    useContext(UserContext);
  const history = useNavigate();
  let fullName = currentUser.givenName + " " + currentUser.familyName;
  return (
    <>
      <Box sx={{ flexGrow: 1, paddingBottom: 8 * 10 + "px" }}>
        <AppBar          
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              align="left"
              component="div" 
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => {history("/")}}
            >
              Crisp
            </Typography>
            <Box style={{ flexGrow: 0 }}>
              {renderRightSide({
                login,
                logout,
                fullName,
                picture: currentUser.picture,
                isAuthenticated,
              })}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
