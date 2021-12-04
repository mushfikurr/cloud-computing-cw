import {
  Grid,
  Container,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Fade,
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
];

export default function RecentPosts() {
  return (
    <>
      <ImageList cols={3} gap={6}>
        {randomImages.map((image, index) => {
          return (
            <Fade
              in={true}
              style={{
                transitionDelay: ((100 * index) ^ 2) + 50 + "ms",
              }}
            >
              <ImageListItem>
                <img src={image.url} alt={image.description} loading="lazy" />
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
            </Fade>
          );
        })}
      </ImageList>
    </>
  );
}
