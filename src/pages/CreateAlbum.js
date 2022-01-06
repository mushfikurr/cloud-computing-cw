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
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";
import { grey } from '@mui/material/colors';
import { publicUrl } from "../components/CommonURLs";
import ClearIcon from '@mui/icons-material/Clear';
import PageTemplate from "./PageTemplate";
import { useSnackbar } from "notistack";
import { CustomImageList } from "../components/CustomImageList";
import { LoadingButton } from "@mui/lab";

export default function CreateAlbum() {
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useContext(UserContext);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  const [currentImages, setCurrentImages] = useState([]);
  const [currentSelectedImages, setCurrentSelectedImages] = useState([]);
  const [currentAlbumName, setCurrentAlbumName] = useState();

  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const createAlbum = () => {
    setIsCreatingAlbum(true);
    var formData = new FormData();
    formData.append("album_title", currentAlbumName);
    formData.append("images", currentSelectedImages);
    axios({
      method: "post",
      url: "/api/album/create",
      data: formData,
    })
    .then(function (response) {
      setIsCreatingAlbum(false);
      setCurrentSelectedImages([]);
      setCurrentAlbumName("");
      enqueueSnackbar("Album created successfully!", {
        autoHideDuration: 2000,
        resumeHideDuration: 0,
        variant: "Success",
      });
    })
    .catch(function (response) {
      setIsCreatingAlbum(false);
      enqueueSnackbar("There was an error creating your album.", {
        autoHideDuration: 2000,
        resumeHideDuration: 0,
        variant: "Error",
      });
    });
  }

  const [imagesLoading, setImagesLoading] = useState(false);
  const getUserImages = () => {
    setImagesLoading(true);
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
        setImagesLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setImagesLoading(false);
      });
  };

  useEffect(() => {
    getUserImages();
  }, []);
  

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

  const imageListProps = {
    currentImages: currentImages,
    currentSelectedImages: currentSelectedImages,
    setCurrentSelectedImages: setCurrentSelectedImages,
    isEditing: true,
    navigateToImage: false,
    isLoading: imagesLoading,
    cols: 6,
    gaps: 0,
    indivSx: { height: "300px"}
  }

  return (
    <PageTemplate>
      <Container style={{ padding: "10px" }}>
        <Typography variant="h4">Create an album</Typography>
        <Card>
          <CardContent>
        <Box sx={{ paddingBottom: "16px" }}>
          {renderTextField()}
        </Box>
        <Collapse in={currentSelectedImages.length > 0} out={currentSelectedImages.length === 0}>
          <Box>
            <Typography variant="subtitle2" color={"#bb86fc"}>Selected images: {currentSelectedImages.length} 
              <IconButton onClick={() => {setCurrentSelectedImages([])}} size="small" style={{marginBottom: "2px", marginLeft: "6px"}}>
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </Typography>
          </Box>
        </Collapse>
        <Box style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <CustomImageList {...imageListProps }/>
        </Box>
        
        <Collapse in={currentSelectedImages.length > 0 && currentAlbumName}>
          <LoadingButton loading={isCreatingAlbum} variant="contained" onClick={() => {createAlbum()}}>Create</LoadingButton>
        </Collapse>
        </CardContent>
        </Card>
      </Container>
    </PageTemplate>
  );
}
