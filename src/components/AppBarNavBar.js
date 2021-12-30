import { useState, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { UserContext } from "../utils/UserProvider";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import InboxIcon from "@mui/icons-material/Inbox";
import PersonIcon from "@mui/icons-material/Person";
import UploadIcon from "@mui/icons-material/Upload";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useNavigate } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import GoogleLogin from "react-google-login";
import {
  ListItemText,
  Toolbar,
  List,
  Button,
  Tooltip,
  Avatar,
  CssBaseline,
  Typography,
  Divider,
  ListItem,
  Box,
  IconButton,
} from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const menuItems = [
  { title: "Home", icon: <HomeIcon />, link: "/" },
  { title: "Profile", icon: <PersonIcon />, link: "/profile" },
  { title: "Upload", icon: <UploadIcon />, link: "/upload" },
  { title: "Create album", icon: <CollectionsIcon />, link: "/album" },
  { title: "Shared with me", icon: <InboxIcon />, link: "/" },
];

export default function AppBarNavBar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const history = useNavigate();
  const { currentUser, login, logout, isAuthenticated } =
    useContext(UserContext);
  let fullName = currentUser.givenName + " " + currentUser.familyName;
  const handleRouteChange = (title) => {
    history(title.link);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const renderRightSide = (props) => {
    const onSuccess = (response) => {
      props.login(response.tokenId);
    };

    const onFailure = (response) => {
      console.log(response);
    };

    return props.isAuthenticated() ? (
      <>
        <Button
          variant="warning"
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
          <Button variant="warning" onClick={renderProps.onClick}>
            Login
          </Button>
        )}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, paddingBottom: 8 * 10 + "px" }}>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((text, index) => {
            return (
              <ListItem
                onClick={() => handleRouteChange(text)}
                button
                key={text.title}
              >
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.title} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}
