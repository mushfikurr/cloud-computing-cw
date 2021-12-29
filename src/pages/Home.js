import { UserContext } from "../utils/UserProvider";
import { useContext, useState } from "react";
import RecentPosts from "../components/RecentPosts";
import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Typography,
  Container,
  Backdrop,
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';

export default function Home() {
  const { isAuthenticated, currentUser, isLoading } = useContext(UserContext);

  const [ isAlertOpen, setIsAlertOpen ] = useState(true);

  return isAuthenticated() ? (
    <>
      {/* This is logged in */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <UserAppBar />
      <NavBar />
      <Container>
        <Typography variant="h4">Hi {currentUser.givenName}</Typography>
        <Typography variant="subtitle2">Recent Crisp images</Typography>
        <RecentPosts />
      </Container>
    </>
  ) : (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* This is not logged in */}
      <UserAppBar />
      <Container>
          <Collapse in={isAlertOpen}>
            <Alert
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsAlertOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <AlertTitle>You are not logged in!</AlertTitle>
              To be able to share images on Crisp - please login.
            </Alert>
          </Collapse>
        <Typography variant="h4">Recent Crisp images</Typography>
        <RecentPosts />
      </Container>
    </>
  );
}
