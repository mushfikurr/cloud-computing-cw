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
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useCopyToClipboard } from "../components/useCopyToClipboard";
import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import { rootUrl } from "../components/CommonURLs";
import LoadingButton from '@mui/lab/LoadingButton';
import {useDropzone} from 'react-dropzone'
import { grey } from "@mui/material/colors";

const ImageUploadDropzone = () => {
  const [currentFile, setCurrentFile] = useState();
  const [currentCaption, setCurrentCaption] = useState();

  // const uploadFile = () => {  
  //   var formData = new FormData();
  //   formData.append("image", currentFile);
  //   formData.append("caption", currentCaption);
  //   setIsLoading(true);
  //   axios({
  //     method: "post",
  //     url: "/api/image/new",
  //     data: formData,
  //   })
  //     .then(function (response) {
  //       console.log(response.data);
  //       copy(rootUrl + "image/" + response.data.img_hash);
  //       onSuccess();
  //     })
  //     .catch(function (response) {
  //       console.log(response);
  //       setIsLoading(false);
  //       enqueueSnackbar("Unable to upload image.", {
  //         autoHideDuration: 1500,
  //         resumeHideDuration: 0,
  //         variant: "Error",
  //       });
  //     });
  // };

  const onDrop = useCallback(acceptedFiles => {
    setCurrentFile(acceptedFiles[0]);
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/jpeg, image/png', onDrop})

  const renderDragMessage = () => {
    if (isDragActive) {
      return <Typography variant="h7">Drop your image here!</Typography> 
    }else{
      if (currentFile) {
        return <Typography variant="h7">Drop another image here to change or click to browse.</Typography> 
      }else{
        return <Typography variant="h7">Drop image here or click to browse.</Typography>
      }
    }
  }

  const renderDropzone = () => {
    return (
      <Box style={{height: "250px"}} sx={{ border: '1px dashed grey', backgroundColor: isDragActive ? grey[100] : "" }} {...getRootProps()}>
        <Grid container alignItems="center" justifyContent="center" style={{height: "100%"}}>
          <Grid item>
            <input {...getInputProps()} />
              { renderDragMessage() }
          </Grid>
        </Grid> 
      </Box>
    )
  }

  const renderFilePreview = () => {
    if (currentFile) {
      return(
        <Paper variant="outlined" sx={{padding: "12px"}}>
          
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">{currentFile.path}</Typography>
            </Grid>
            <Grid item>
              <Button onClick={() => {setCurrentFile()}} disableElevation>Clear</Button>
              <Button variant="contained" disableElevation style={{ marginLeft: "4px"}}>Upload</Button>
            </Grid>
          </Grid>
         
          
        </Paper>
      ) 
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        
        <Grid container direction="column" style={{height: "100%"}} spacing={2}>
          <Grid item>
            <TextField onChange={(e) => {setCurrentCaption(e.target.value)}} label="Image caption (optional)" variant="standard" size="small" fullWidth />
          </Grid>
          <Grid item>
            { renderDropzone() }
          </Grid>
          <Grid item>
            <Collapse in={currentFile} out={!currentFile}>
              {renderFilePreview()}
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const ImageUpload = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState();
  const [currentCaption, setCurrentCaption] = useState();
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
        copy(rootUrl + "image/" + response.data.img_hash);
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
      return <LoadingButton loading={isLoading} variant="outlined" style={{ marginRight: "8px"}} disabled>Upload</LoadingButton>
    }else{
      return <Button variant="contained" onClick={uploadFile} component="span">Upload</Button>
    }
  }

  const renderChangeButton = () => {
    if (isLoading) {
      return (
        <label htmlFor="contained-button-file">
          
          <LoadingButton loading={isLoading} variant="outlined" style={{ marginRight: "8px"}} disabled>
            Change
          </LoadingButton>
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

  const renderImageSelect = () => {
    return (
      <>
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
    )
  }

  return (
    <>
      <Typography variant="h4" style={{ paddingBottom: "20px" }}>
        Upload an image
      </Typography>
      <ImageUploadDropzone />
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
