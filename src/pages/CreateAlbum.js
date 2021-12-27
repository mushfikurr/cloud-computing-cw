import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Input,
  Button,
  Container,
  ButtonGroup,
  Typography,
  Box,
} from "@mui/material";




export default function CreateAlbum() {
  const { currentUser } = useContext(UserContext);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  return (
    <>
      <Container style={{ padding: "10px" }}>
        <UserAppBar />
        <NavBar />
        <Typography variant="h4" style={{ paddingBottom: "20px" }}>
          Create Album
        </Typography>
      </Container>
    </>
  );
}
