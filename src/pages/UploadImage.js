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
  Stack,
  Grid,
  Checkbox,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useCopyToClipboard } from "../components/useCopyToClipboard";
import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import { rootUrl } from "../components/CommonURLs";
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";
import { useDropzone } from "react-dropzone";
import { grey } from "@mui/material/colors";
import AppBarNavBar from "../components/AppBarNavBar";
import PageTemplate from "./PageTemplate";
import { Label } from "@mui/icons-material";
import { useTheme } from "@mui/styles";

const ImageUploadDropzone = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentFile, setCurrentFile] = useState();
  const [currentCaption, setCurrentCaption] = useState();
  const [successfulImage, setSuccessfulImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, copy] = useCopyToClipboard("");
  const [isPublic, setIsPublic] = useState(true);
  const theme = useTheme();

  const onSuccess = (img_hash) => {
    setSuccessfulImage({ hash: img_hash, img: currentFile });
    setIsLoading(false);
    setCurrentFile();
    setCurrentCaption();
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
    formData.append("public", isPublic ? 1 : 0);
    setIsLoading(true);
    axios({
      method: "post",
      url: "/api/image/new",
      data: formData,
    })
      .then(function (response) {
        onSuccess(response.data.img_hash);
      })
      .catch(function (response) {
        setIsLoading(false);
        enqueueSnackbar("Unable to upload image.", {
          autoHideDuration: 1500,
          resumeHideDuration: 0,
          variant: "Error",
        });
      });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setCurrentFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop,
  });

  const renderDragMessage = () => {
    if (isDragActive) {
      return <Typography variant="h7">Drop your image here!</Typography>;
    } else {
      if (currentFile) {
        return (
          <Typography variant="h7">
            Drop another image here to change or click to browse.
          </Typography>
        );
      } else {
        return (
          <>
          <Typography variant="h7">
            Drop image here or click to browse.
          </Typography>
          </>
        );
      }
    }
  };

  const renderDropzone = () => {
    return (
      <Box
        style={{ height: "250px" }}
        sx={{
          border: "1px dashed grey",
          backgroundColor: isDragActive ? grey[800] : "",
        }}
        {...getRootProps()}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ height: "100%" }}
        >
          <Grid item>
            <input {...getInputProps()} />
            {renderDragMessage()}
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleCopy = () => {
    enqueueSnackbar("Image copied to clipboard successfully!", {
      autoHideDuration: 2000,
      resumeHideDuration: 0,
      variant: "Success",
    });
    copy(rootUrl + "image/" + successfulImage.hash);
  };

  const renderSuccessfulImagePreview = () => {
    if (successfulImage) {
      return (
        <>
        <Paper variant="outlined" sx={{ padding: "12px" }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="overline">Complete</Typography>
              <Typography variant="body2">
                {successfulImage.img.path}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  setSuccessfulImage();
                }}
                disableElevation
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  handleCopy();
                }}
                variant="contained"
                disableElevation
                style={{ marginLeft: "4px" }}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
        </Paper>
        </>
      );
    }
  };

  const toggleCheckbox = () => {
    if (isPublic) { 
      setIsPublic(false);
    }else{
      setIsPublic(true);
    }
  }

  const renderFilePreview = () => {
    if (currentFile) {
      return (
        <Paper variant="outlined" sx={{ padding: "12px" }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">{currentFile.path}</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center">
                <Typography sx={{marginTop: "1px"}} variant="body2">Make public?</Typography><Checkbox sx={{marginRight: "4px"}}checked={isPublic} onChange={toggleCheckbox} />
                <LoadingButton
                  loading={isLoading}
                  onClick={() => {
                    setCurrentFile();
                  }}
                  disableElevation
                >
                  Clear
                </LoadingButton>
                <LoadingButton
                  loading={isLoading}
                  onClick={() => {
                    uploadFile();
                  }}
                  variant="contained"
                  disableElevation
                  style={{ marginLeft: "4px" }}
                >
                  Upload
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      );
    }
  };

  return (
    <>
      {/* <Typography variant="h4" style={{ marginBottom: "16px" }}>
        Upload an image
      </Typography> */}
      <Typography variant="h4" sx={{marginBottom: "8px"}}>Upload an image</Typography>
      <Card>
        <CardContent>
          <Grid
            container
            direction="column"
            style={{ height: "100%" }}
            spacing={3}
          >
            <Grid item>
              <TextField
                onChange={(e) => {
                  setCurrentCaption(e.target.value);
                }}
                label="Image caption (optional)"
                variant="standard"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item>{renderDropzone()}</Grid>
            <Grid item>
              <Collapse in={currentFile} out={!currentFile}>
                <Box>{renderFilePreview()}</Box>
              </Collapse>
              <Collapse in={successfulImage} out={!successfulImage}>
                <Box sx={{ paddingTop: "4px" }}>
                  {renderSuccessfulImagePreview()}
                </Box>
              </Collapse>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default function UploadImage() {
  return (
    <PageTemplate>
      <Container style={{ padding: "10px" }}>
        <ImageUploadDropzone />
      </Container>
    </PageTemplate>
  );
}
