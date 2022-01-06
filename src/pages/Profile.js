import { UserContext } from "../utils/UserProvider";
import { useContext, useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Divider,
  Avatar,
  Grid,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { publicUrl } from "../components/CommonURLs";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import { CustomImageList } from "../components/CustomImageList";
import { AlbumDialog } from "../components/AlbumDialog";
import { EditBar } from "../components/EditBar";
import { useSnackbar } from "notistack";

const RenderAlbumPreviews = (props) => {
  const [showDialog, openDialog] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(false);
  const handleAlbum = (album) => {
    setCurrentAlbum(album);
    openDialog(true);
  }

  const imageListProps = {
    currentImages: props.albumPreviews,
    handleAlbum: handleAlbum,
    currentSelectedImages: props.currentSelectedAlbums, setCurrentSelectedImages: props.setCurrentSelectedAlbums,
    isAlbum: true,
    indivSx: {height: "200px", width: "200px"},
    isEditing: props.editMode,
    captionFullHeight: true,
    navigateToImage: false,
    isLoading: props.imagesLoading,
    cols: 6,
    gaps: 1,
  }

  return (
    <>
      <CustomImageList {...imageListProps} />
      <AlbumDialog
          currentAlbum={currentAlbum}
          openDialog={openDialog}
          showDialog={showDialog}
        />
    </>
  );
};



export default function Profile() {
  const { currentUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [currentImages, setCurrentImages] = useState([]);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  const [albumPreviews, setPreviewImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSelectedAlbums, setCurrentSelectedAlbums] = useState([]);
  const [currentSelectedImages, setCurrentSelectedImages] = useState([]);

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
        setCurrentImages([]);
        setImagesLoading(false);
      });
  };

  const [previewsLoading, setPreviewsLoading] = useState(false);
  const getAlbumPreviews = () => {
    setPreviewsLoading(true);
    var config = {
      method: "get",
      url: "/api/album/previews",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    axios(config)
      .then(function (response) {
        setPreviewImages(response.data.albums);
        setPreviewsLoading(false);
      })
      .catch(function (error) {
        setPreviewsLoading(false);
        setPreviewImages([]);
        console.log(error);
      });
  };

  const refreshAll = () => {
    getAlbumPreviews();
    getUserImages();
  }

  useEffect(() => {
    getAlbumPreviews();
    getUserImages();
  }, []);

  const profilePictureProps = {
    currentImages: currentImages,
    isEditing: editMode,
    navigateToImage: true,
    currentSelectedImages: currentSelectedImages, setCurrentSelectedImages: setCurrentSelectedImages,
    sx: {"height": "200px"},
    gaps: 2,
    isLoading: previewsLoading,
  }

  const [imagesDeleting, setImagesDeleting] = useState(false);
  const onDeleteImage = () => {
    if (currentSelectedImages.length > 0) {
      var formData = new FormData();
      setImagesDeleting(true);
      formData.append("images", currentSelectedImages);
      axios({
        method: "post",
        url: "/api/image/delete",
        data: formData,
      })
      .then(function (response) {
        setCurrentSelectedImages([]);
        refreshAll();
        setImagesDeleting(false);
        enqueueSnackbar("Image deleted successfully!", {
          autoHideDuration: 2000,
          resumeHideDuration: 0,
          variant: "Success",
        });
      })
      .catch(function (response) {
        setImagesDeleting(false);
        enqueueSnackbar("There was an error deleting your image.", {
          autoHideDuration: 2000,
          resumeHideDuration: 0,
          variant: "Error",
        });
      });
    }
  }

  const [albumDeleting, setAlbumDeleting] = useState(false);
  const onDeleteAlbum = () => {
    if (currentSelectedAlbums.length > 0) {
      setAlbumDeleting(true);
      var formData = new FormData();
      formData.append("albums", currentSelectedAlbums);
      axios({
        method: "post",
        url: "/api/album/delete",
        data: formData,
      })
      .then(function (response) {
        setCurrentSelectedAlbums([]);
        refreshAll();
        setAlbumDeleting(false);
        enqueueSnackbar("Image deleted successfully!", {
          autoHideDuration: 2000,
          resumeHideDuration: 0,
          variant: "Success",
        });
      })
      .catch(function (response) {
        setAlbumDeleting(false);
        enqueueSnackbar("There was an error deleting your image.", {
          autoHideDuration: 2000,
          resumeHideDuration: 0,
          variant: "Error",
        });
      });
    }
  }

  return (
    <PageTemplate>
      <Container sx={{paddingTop: "36px"}}>
        <Grid container spacing={1}> 
          <Grid item xs={3} align="center">
            <Box>
              {" "}
              <Avatar alt={fullName} src={currentUser.picture} sx={{ height: "200px", width: "200px", marginBottom: "8px"}}/>
              <Typography variant="h5">{fullName}</Typography>
              <Typography variant="h6" color={grey[600]}>
                {currentUser.email}
              </Typography>
            </Box>
          </Grid>
          <Divider />
          <Grid item xs={9}>
            <Container align="left" style={{ paddingTop: "16px" }}>
              <EditBar heading={"Your albums"} setEditMode={setEditMode} editPrompt={"Select albums to edit"} editStatus={editMode} onAction={albumDeleting} onDelete={()=>{onDeleteAlbum()}} />
              <RenderAlbumPreviews imagesLoading={imagesLoading} albumPreviews={albumPreviews} editMode={editMode} currentSelectedAlbums={currentSelectedAlbums} setCurrentSelectedAlbums={setCurrentSelectedAlbums} />
              <Divider sx={{ marginBottom: 2 }} />
              <EditBar heading={"Your posts"} setEditMode={setEditMode} editPrompt={"Select images to edit"} editStatus={editMode} onAction={imagesDeleting} onDelete={() => {onDeleteImage()}} />
              <CustomImageList {...profilePictureProps} />
            </Container>
          </Grid>
        </Grid>
      </Container>
    </PageTemplate>
  );
}
