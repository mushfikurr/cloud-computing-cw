import { UserAppBar } from "../components/AppBar";
import NavBar from "../components/NavBar";
import {
  Input,
  Button,
  Container,
  ButtonGroup,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useSnackbar } from "notistack";

const ImageUpload = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentFile, setCurrentFile] = useState();
  const [currentCaption, setCurrentCaption] = useState();
  const handleChange = (e) => {
    setCurrentFile(e.target.files[0]);
  };

  const onSuccess = () => {
    setCurrentFile();
    setCurrentCaption();
    enqueueSnackbar("Image uploaded successfully!", {
      autoHideDuration: 1500,
      resumeHideDuration: 0,
      variant: "Success",
    });
  };

  const uploadFile = () => {
    var formData = new FormData();
    formData.append("image", currentFile);
    formData.append("caption", currentCaption);
    axios({
      method: "post",
      url: "/api/image/new",
      data: formData,
    })
      .then(function (response) {
        console.log(response.data);
        onSuccess();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  return (
    <>
      <Typography variant="h4" style={{ paddingBottom: "20px" }}>
        Upload an image
      </Typography>

      {currentFile ? (
        <>
          <Box style={{ margin: "8px" }}>
            <img src={URL.createObjectURL(currentFile)} />
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
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <label htmlFor="contained-button-file">
                  <Button variant="contained" component="span">
                    Change
                  </Button>
                </label>
                <Button
                  variant="contained"
                  onClick={uploadFile}
                  component="span"
                >
                  Upload
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
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
