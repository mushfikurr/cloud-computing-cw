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
import { CustomImageList } from "./CustomImageList";

export default function RecentPosts() {
  const [currentImages, setCurrentImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const getRecentImages = () => {
    setIsLoading(true);
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
          setIsLoading(false);
        } else {
          setCurrentImages([]);
          setIsLoading(false);
        }

      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getRecentImages();
  }, []);

  const imageListProps = {
    currentImages: currentImages,
    navigateToImage: true,
    isEditing: false,
    cols: 6,
    gaps: 3,
    isLoading: isLoading,
  }

  return (
    <>
      <CustomImageList {...imageListProps} />
    </>
  );
}
