import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Fade,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";

const randomImages = [
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
  {
    url: "https://picsum.photos/500/500",
    description: "Image Description",
    title: "Image Test",
    author: "Zaid Ashraf",
  },
];

export default function RecentPosts() {
  const [currentImages, setCurrentImages] = useState([]);

  const getRecentImages = () => {
    var config = {
      method: "get",
      url: "/api/image/recent",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    axios(config)
      .then(function (response) {
        setCurrentImages(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getRecentImages();
  }, []);

  return (
    <>
      <ImageList cols={3} gap={6}>
        {currentImages.map((image, index) => {
          return (
            <Fade
              in={true}
              style={{
                transitionDelay: ((80 * index) ^ 2) + 50 + "ms",
              }}
            >
              <ImageListItem>
                <img src={image.image} alt={image.caption} loading="lazy" />
                <ImageListItemBar
                  title={image.caption}
                  subtitle={image.author}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${image.caption}`}
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
