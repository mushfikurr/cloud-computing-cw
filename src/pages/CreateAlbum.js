import { UserContext } from "../utils/UserProvider";
import { useContext } from "react";
import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Container,
  TextField,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { IconButton, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateAlbum() {
  const { currentUser } = useContext(UserContext);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  const [currentImages, setCurrentImages] = useState([]);
  const [currentSelectedImages, setCurrentSelectedImages] = useState([]);
  const [currentAlbumName, setCurrentAlbumName] = useState();

  const handleClick = (imageid) => {
    if (currentSelectedImages.includes(imageid)) {
      setCurrentSelectedImages(
        currentSelectedImages.filter((compareId) => {
          return imageid !== compareId;
        })
      );
    } else {
      setCurrentSelectedImages([...currentSelectedImages, imageid]);
    }
  };

  const getUserImages = () => {
    var config = {
      method: "get",
      url: "/api/image/user",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    axios(config)
      .then(function (response) {
        setCurrentImages(response.data.images);
        console.log(response.data.images);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserImages();
  }, []);

  useEffect(() => {
    console.log(currentSelectedImages);
  }, [currentSelectedImages]);

  const renderImage = (image) => {
    if (currentSelectedImages.includes(image.id)) {
      return (
        <img
          src={image.image}
          alt={image.caption}
          loading="lazy"
          style={{ border: "solid 2px #1e88e5" }}
        />
      );
    } else {
      return <img src={image.image} alt={image.caption} loading="lazy" />;
    }
  };

  return (
    <>
      <Container style={{ padding: "10px" }}>
        <UserAppBar />
        <NavBar />
        <Typography variant="h4" style={{ paddingBottom: "20px" }}>
          Create Album
        </Typography>
        <Box sx={{ paddingBottom: "16px" }}>
          <TextField
            id="input-name"
            label="Album name"
            variant="standard"
            onChange={(e) => {
              setCurrentAlbumName(e.target.value);
            }}
          />
        </Box>
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
                <ImageListItem
                  onClick={(e) => {
                    handleClick(image.id);
                  }}
                >
                  {renderImage(image)}
                  <ImageListItemBar
                    title={image.caption}
                    subtitle={image.user_full_name}
                  />
                </ImageListItem>
              </Fade>
            );
          })}
        </ImageList>
      </Container>
    </>
  );
}
