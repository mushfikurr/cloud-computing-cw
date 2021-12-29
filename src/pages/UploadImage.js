import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Input,
  Button,
  Container,
  Fade,
  Collapse,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useCopyToClipboard } from "../components/useCopyToClipboard";
import { useState } from "react";
import { useSnackbar } from "notistack";

const ImageUpload = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState();
  const [currentCaption, setCurrentCaption] = useState();
  const publicUrl = "http://localhost:3000/image/";
  const [copied, copy] = useCopyToClipboard("");
  const handleChange = (e) => {
    setCurrentFile(e.target.files[0]);
  };

  const onSuccess = () => {
    setIsLoading(false);
    setCurrentFile();
    setCurrentCaption();
    enqueueSnackbar("Image copied to clipboard!", {
      autoHideDuration: 2500,
      resumeHideDuration: 0,
      variant: "Success",
    });
    enqueueSnackbar("Image uploaded successfully!", {
      autoHideDuration: 2000,
      resumeHideDuration: 0,
      variant: "Success",
    });
  };

  
  const uploadFile = () => {
    
    var formData = new FormData();
    formData.append("image", currentFile);
    formData.append("caption", currentCaption);
    setIsLoading(true);
    axios({
      method: "post",
      url: "/api/image/new",
      data: formData,
    })
      .then(function (response) {
        console.log(response.data);
        copy(publicUrl + response.data.img_hash);
        onSuccess();
      })
      .catch(function (response) {
        console.log(response);
        setIsLoading(false);
        enqueueSnackbar("Unable to upload image.", {
          autoHideDuration: 1500,
          resumeHideDuration: 0,
          variant: "Error",
        });
      });
  };

  
  

  const renderUploadButton = () => {
    if (isLoading) {
      return <Button variant="contained" onClick={uploadFile} component="span" disabled>Upload</Button>
    }else{
      return <Button variant="contained" onClick={uploadFile} component="span">Upload</Button>
    }
  }

  const renderChangeButton = () => {
    if (isLoading) {
      return (
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" style={{ marginRight: "8px"}} disabled>
            Change
          </Button>
        </label>)
    }else{
      return (
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" style={{ marginRight: "8px"}}>
            Change
          </Button>
        </label>)
    }
  }

  return (
    <>
      {copied && 'Copied!'}
      <Typography variant="h4" style={{ paddingBottom: "20px" }}>
        Upload an image
      </Typography>

      {currentFile ? (
        <>
          <Collapse in={true}>
            <Box style={{ width: "inherit"}}>
              <Box style={{ margin: "8px" }}>
                <Fade in={true}>
                  <img src={URL.createObjectURL(currentFile)} />
                </Fade>
                <Box sx={{ paddingBottom: "16px" }}>
                  <TextField
                    id="input-caption"
                    label="Image caption"
                    variant="standard"
                    onChange={(e) => {
                      setCurrentCaption(e.target.value);
                    }}
                  />
                </Box>
                <Box>
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  { renderChangeButton() }
                  { renderUploadButton() }
                </Box>
              </Box>
            </Box>
          </Collapse>
        </>
      ) : (
        <>
          <Input
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Choose a photo
            </Button>
          </label>
        </>
      )}
    </>
  );
};

export default function UploadImage() {
  return (
    <>
      <Container style={{ padding: "10px" }}>
        <UserAppBar />
        <NavBar />
        <ImageUpload />
      </Container>
    </>
  );
}
