import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, CircularProgress, DialogActions, Box, ImageList, Fade, ImageListItem, ImageListItemBar } from "@mui/material";
import { publicUrl } from "./CommonURLs";


export const AlbumDialog = (props) => {
    const [albumImages, setAlbumImages] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
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
          console.log("getting images...")
          if (props.showDialog) {
            setAlbumImages(response.data.images);
            setIsLoading(false);
          }
        })
        .catch(function (error) {
          setIsLoading(false);
        });
    };
  
    useEffect(() => {
      if (props.showDialog) {
        getImagesFromAlbum();
      }
      
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