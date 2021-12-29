import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import { UserContext } from "../utils/UserProvider";
import { useContext, useState, useEffect } from "react";
import { Typography, Container, Box, Divider, ImageList, ImageListItem, ImageListItemBar, Fade} from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from 'axios';
import { publicUrl } from "../components/CommonURLs";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useContext(UserContext);
  const [currentImages, setCurrentImages] = useState([]);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  const navigate = useNavigate();

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

  const handleClick = (imageName) => {
    navigate('/image/' + imageName);
  }

  return (
    <>
      <UserAppBar />
      <NavBar />
      <Container align="center">
        <Box style={{ paddingBottom: "8px" }}>
          {" "}
          <img src={currentUser.picture} />
          <Typography variant="h3">{fullName}</Typography>
          <Typography variant="h6" color={grey[600]}>
            {currentUser.email}
          </Typography>
        </Box>
        <Divider />
        <Container align="left" style={{ paddingTop: "16px" }}>
          <Typography variant="h5">Your posts</Typography>
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
                <ImageListItem style={{cursor: "pointer"}} onClick={() => {handleClick(image.image)}}>
                  <img src={publicUrl + image.image} alt={image.caption} loading="lazy" />
                  {image.caption && <ImageListItemBar title={image.caption} />}
                </ImageListItem>
              </Fade>
            );
          })}
        </ImageList>
        </Container>
      </Container>
    </>
  );
}
