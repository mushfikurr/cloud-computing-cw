import { UserContext } from "../utils/UserProvider";
import { useContext, useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  ButtonGroup,
  Collapse,
  Paper,
  Stack,
  CircularProgress,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { rootUrl, publicUrl } from "../components/CommonURLs";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";

const RenderAlbumPreviews = (props) => {
  const [showDialog, openDialog] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(false);
  return (
    <>
      <ImageList cols={6} gap={6}>
        {props.albumPreviews.map((album, index) => {
          return (
            <Fade
              in={true}
              key={album.id}
              style={{
                transitionDelay: ((80 * index) ^ 2) + 50 + "ms",
              }}
            >
              <ImageListItem
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentAlbum(album);
                  openDialog(true);
                }}
              >
                <img
                  src={publicUrl + album.preview_img}
                  alt={album.title}
                  loading="lazy"
                />
                {album.title && (
                  <ImageListItemBar
                    title={album.title}
                    style={{ height: "100%" }}
                  />
                )}
              </ImageListItem>
            </Fade>
          );
        })}
        <AlbumDialog
          currentAlbum={currentAlbum}
          openDialog={openDialog}
          showDialog={showDialog}
        />
      </ImageList>
    </>
  );
};

const AlbumDialog = (props) => {
  const [albumImages, setAlbumImages] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Current Album
  const getImagesFromAlbum = () => {
    var formData = new FormData();
    formData.append("album_id", props.currentAlbum.id);
    setIsLoading(true);
    axios({
      method: "post",
      url: "/api/album",
      data: formData,
    })
      .then(function (response) {
        setIsLoading(false);
        setAlbumImages(response.data.images);
      })
      .catch(function (error) {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (props.showDialog) getImagesFromAlbum();
  }, [props.showDialog]);

  const handleClose = () => {
    props.openDialog(false);
  };

  return (
    <>
      <Dialog
        open={props.showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.currentAlbum.title}
        </DialogTitle>
        <DialogContent>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading && <CircularProgress />}
            <ImageList cols={3} gap={0}>
              {albumImages.map((image, index) => {
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
                        handleClose();
                        navigate("/image/" + image.image);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={publicUrl + image.image}
                        alt={image.caption}
                        loading="lazy"
                      />
                      {image.caption && (
                        <ImageListItemBar title={image.caption} />
                      )}
                    </ImageListItem>
                  </Fade>
                );
              })}
            </ImageList>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Profile() {
  const { currentUser } = useContext(UserContext);
  const [currentImages, setCurrentImages] = useState([]);
  const fullName = currentUser.givenName + " " + currentUser.familyName;
  const [albumPreviews, setPreviewImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSelectedImages, setCurrentSelectedImages] = useState([]);
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAlbumPreviews = () => {
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAlbumPreviews();
    getUserImages();
  }, []);

  const handleClick = (imageName) => {
    navigate("/image/" + imageName);
  };

  // now you could technically make another function called renderEditImagePreview, and
  // kinda copy the album select logic over into this function
  // you'd need an array state of some sort, like we did in create album
  const renderEditMode = () => {
    if (editMode) {
      return renderEditImagePreview();
    } else {
      return renderImagePreviews();
    }
  };

  // so maybe make a new arrow function called, idk renderSelectedImage ?
  // then put all that nonsense in there
  // now u need the .map of all the images, then instead of rendering
  // <img, you would render renderSelectedImage instead
  // would this be a new function too?
  useEffect(() => {
    console.log(currentSelectedImages);
  }, [currentSelectedImages]);

  const renderSelectedImage = (image) => {
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
      return (
        <img src={publicUrl + image.image} alt={image.caption} loading="lazy" />
      );
    }
  };

  const handleEditClick = (imageid) => {
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

  // now u can change the onClick handlers for these images..
  const renderEditImagePreview = () => {
    return (
      <>
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
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleEditClick(image.id);
                }}
              >
                {renderSelectedImage(image)}
                {image.caption && <ImageListItemBar title={image.caption} />}
              </ImageListItem>
            </Fade>
          );
        })}
      </>
    );
  };

  // Ok so now you have a new function, to be able to call this.. we need tof irst check if
  // its in edit mode or not, if its not, then just display as normal, u can use ur above function for this
  const renderImagePreviews = () => {
    return (
      <>
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
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleClick(image.image);
                }}
              >
                <img
                  src={publicUrl + image.image}
                  alt={image.caption}
                  loading="lazy"
                />
                {image.caption && <ImageListItemBar title={image.caption} />}
              </ImageListItem>
            </Fade>
          );
        })}
      </>
    );
  };

  return (
    <PageTemplate>
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
          <Typography variant="h5">Your albums</Typography>
          <RenderAlbumPreviews albumPreviews={albumPreviews} />
          <Divider sx={{ marginBottom: 2 }} />
          <Stack direction="row" alignItems="center" sx={{ marginBottom: 1 }}>
            <Typography variant="h5">Your posts</Typography>
            <IconButton
              onClick={() => {
                if (editMode) {
                  setEditMode(false);
                } else {
                  setEditMode(true);
                }
              }}
              size="small"
              sx={{ marginLeft: 1 }}
            >
              {!editMode ? (
                <EditIcon fontSize="inherit" />
              ) : (
                <CloseIcon fontSize="inherit" />
              )}
            </IconButton>
          </Stack>

          <Collapse in={editMode}>
            <Paper
              elevation={0}
              sx={{ padding: 1, backgroundColor: grey[100] }}
            >
              <Stack direction="row" alignItems="center">
                <Typography variant="body2" sx={{ paddingRight: "43px" }}>
                  Select images to edit
                </Typography>
                <Button
                  disableElevation
                  variant="contained"
                  sx={{ marginRight: "4px" }}
                  onClick={() => {
                    currentImages.map((image) => {
                      setCurrentSelectedImages([
                        ...currentSelectedImages,
                        image.id,
                      ]);
                    });
                  }}
                >
                  Select all
                </Button>
                <Button disableElevation variant="contained">
                  Delete
                </Button>
              </Stack>
            </Paper>
          </Collapse>

          <ImageList cols={6} gap={6} sx={{ height: 645 }}>
            {renderEditMode()}
          </ImageList>
        </Container>
      </Container>
    </PageTemplate>
  );
}
