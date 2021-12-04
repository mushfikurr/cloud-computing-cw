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

export const AppBarAuthed = () => {
  const { currentUser, logout } = useContext(UserContext);
  let fullName = currentUser.givenName + " " + currentUser.familyName;
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
          <Toolbar>
            <Typography
              variant="h6"
              align="left"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Crisp
            </Typography>
            <Box style={{ flexGrow: 0 }}>
              <Button
                variant="warning"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Button>
              <Tooltip title="Open settings">
                <IconButton sx={{ p: 1 }}>
                  <Avatar alt={fullName} src={currentUser.picture} />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
