import { UserContext } from "../utils/UserProvider";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  Collapse,
  ImageListItemBar,
  Button,
  Fade,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { grey } from '@mui/material/colors';
import { publicUrl } from "../components/CommonURLs";
import ClearIcon from '@mui/icons-material/Clear';
import AppBarNavBar from "../components/AppBarNavBar";

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
          src={publicUrl + image.image}
          alt={image.caption}
          loading="lazy"
          style={{ border: "solid 2px #1e88e5" }}
        />
      );
    } else {
      return <img src={publicUrl + image.image} alt={image.caption} loading="lazy" />;
    }
  };
  // const renderUploadSection = () => {
  //     if (currentSelectedImages.length > 0) {
  //       return (
         
  //       )
  //     }
  // }
  

  const renderTextField = () => {
      if (currentSelectedImages.length > 0) {
        return <TextField
          id="input-name"
          label="Album name"
          variant="standard"
          size="large"
          style={{ width: "100%"}}
          onChange={(e) => {
            setCurrentAlbumName(e.target.value);
          }}
          focused
        />
      }else{
        return <TextField
          id="input-name"
          label="Album name"
          variant="standard"
          size="large"
          style={{ width: "100%"}}
          onChange={(e) => {
            setCurrentAlbumName(e.target.value);
          }}
        />
      }
      
  }

  return (
    <>
      <AppBarNavBar />
      <Container style={{ padding: "16px" }}>
        
        {/* <Typography variant="h4" style={{ paddingBottom: "20px" }}>
          Create Album
        </Typography> */}
        <Box sx={{ paddingBottom: "16px" }}>
          {renderTextField()}
        </Box>
        <Collapse in={currentSelectedImages.length > 0} out={currentSelectedImages.length === 0}>
          <Box>
            <Typography variant="subtitle2" color={grey[800]}>Selected images: {currentSelectedImages.length} 
              <IconButton onClick={() => {setCurrentSelectedImages([])}} size="small" style={{marginBottom: "2px", marginLeft: "6px"}}>
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </Typography>
          </Box>
        </Collapse>
        <Box style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <ImageList cols={8} gap={0}>
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
                    style={{ cursor: "pointer"}}
                  >
                    {renderImage(image)}
                    {image.caption && <ImageListItemBar title={image.caption} />}
                  </ImageListItem>
                </Fade>
              );
            })}
          </ImageList>
        </Box>
        
        <Collapse in={currentSelectedImages.length > 0 && currentAlbumName}>
          <Button variant="contained">Create</Button>
        </Collapse>
      </Container>
    </>
  );
}
