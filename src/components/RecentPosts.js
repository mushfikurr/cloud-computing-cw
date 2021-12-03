import {
  Grid,
  Container,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";

const randomImages = [
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "hello",
    title: "randomness",
    author: "DEEZ NUTZ",
  },
];

export default function RecentPosts() {
  return (
    <>
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
                            <Info />
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
