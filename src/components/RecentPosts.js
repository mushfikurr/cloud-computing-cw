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
import { publicUrl } from "../components/CommonURLs";

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
        if (response.data) {
          setCurrentImages(response.data.images);
        } else {
          setCurrentImages([]);
        }

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
              key={image.id}
              style={{
                transitionDelay: ((80 * index) ^ 2) + 50 + "ms",
              }}
            >
              <ImageListItem>
                <img src={publicUrl + image.image} alt={image.caption} loading="lazy" />
                <ImageListItemBar
                  title={image.caption ? image.caption : ""}
                  subtitle={image.user_full_name}
                />
              </ImageListItem>
            </Fade>
          );
        })}
      </ImageList>
    </>
  );
}
