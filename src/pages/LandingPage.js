import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import { Toolbar, Typography, ImageList, ImageListItem, ImageListItemBar, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import logo from "../logo.png";

import Flippy, { FrontSide, BackSide } from "react-flippy";

const renderAppBar = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              align="left"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <img src={logo} height='100px' width='113px'></img>
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

const randomImages = [
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ"
  },
];

export default function LandingPage() {
  return (
    <>
      {renderAppBar()}
      <Grid alignItems="center" style={{ height: "100vh" }} container>
        <Grid item xs={12}>
          <Container align="center">
            <Box sx={{ width: 1000, height: 900, overflowY: "scroll" }}>
              <ImageList variant="woven" cols={3} gap={6}>
                {randomImages.map((image) => {
                  return (
                    <ImageListItem>
                      <img
                        src={image.url}
                        alt={image.description}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={image.title}
                        subtitle={image.author}
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                            aria-label={`info about ${image.title}`}
                          >
                          <InfoIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}
