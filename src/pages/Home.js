import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import RecentPosts from "../components/RecentPosts";
import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Typography,
  Container,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function Home() {
  const { isAuthenticated, currentUser, isLoading } = useContext(UserContext);

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
        <Typography variant="subtitle2">Your Crisp feed</Typography>
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
        <Typography variant="h4">Recent Crisp feed</Typography>
        <RecentPosts />
      </Container>
    </>
  );
}
