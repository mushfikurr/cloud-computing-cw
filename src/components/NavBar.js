import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { UserAppBar } from "../components/AppBar";
import PersonIcon from "@mui/icons-material/Person";
import UploadIcon from "@mui/icons-material/Upload";
import CollectionsIcon from "@mui/icons-material/Collections";
import InboxIcon from "@mui/icons-material/Inbox";
import { Slide } from "@mui/material";

const drawerWidth = 240;
const menuItems = [
  { title: "Profile", icon: <PersonIcon /> },
  { title: "Upload", icon: <UploadIcon /> },
  { title: "Create album", icon: <CollectionsIcon /> },
  { title: "Shared with me", icon: <InboxIcon /> },
];

export default function NavBar() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {menuItems.map((text, index) => {
                return (
                  <ListItem button key={text.title}>
                    <ListItemIcon>{text.icon}</ListItemIcon>
                    <ListItemText primary={text.title} />
                  </ListItem>
                );
              })}
            </List>
            <Divider />
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
