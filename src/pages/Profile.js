import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import { Typography, Container, Box, Divider } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function Profile() {
  const { currentUser } = useContext(UserContext);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  return (
    <>
      <UserAppBar />
      <NavBar />
      <Container align="center">
        <Box style={{ paddingBottom: "8px" }}>
          {" "}
          <img src={currentUser.picture} />
          <Typography variant="h3">{fullName}</Typography>
          <Typography variant="h6" color={grey[600]}>
            {currentUser.email}
          </Typography>
        </Box>
        <Divider />
        <Container align="left" style={{ paddingTop: "16px" }}>
          <Typography variant="h5">Your recent posts</Typography>
        </Container>
      </Container>
    </>
  );
}
