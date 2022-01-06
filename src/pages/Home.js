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
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import AppBarNavBar from "../components/AppBarNavBar";
import PageTemplate from "./PageTemplate";


export default function Home() {
  const { isAuthenticated, currentUser, isLoading } = useContext(UserContext);

  const [isAlertOpen, setIsAlertOpen] = useState(true);

  return isAuthenticated() ? (
    <PageTemplate>
      {/* This is logged in */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <Typography variant="h4">Hi {currentUser.givenName}</Typography>
        <Typography variant="subtitle2">Recent Crisp images</Typography>
        <RecentPosts />
      </Container>
    </PageTemplate>
  ) : (
    <PageTemplate>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* This is not logged in */}
      <Container>
        <Collapse in={isAlertOpen}>
          <Alert
           style={{ backgroundColor: grey[900]}}
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
    </PageTemplate>
  );
}
