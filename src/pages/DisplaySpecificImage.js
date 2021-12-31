import { UserAppBar } from "../components/AppBar";
import { useParams } from "react-router-dom";
import { Container, ImageListItem, ImageListItemBar, Box, Divider, Card, CardContent, CardActionArea, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { publicUrl } from "../components/CommonURLs";
import AppBarNavBar from "../components/AppBarNavBar";
import { useSnackbar } from "notistack";
import { useCopyToClipboard } from "../components/useCopyToClipboard";
import { rootUrl } from "../components/CommonURLs";
import PageTemplate from "./PageTemplate";


export default function DisplayPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [copied, copy] = useCopyToClipboard("");
    const { enqueueSnackbar } = useSnackbar();
    const [successfulImage, setSuccessfulImage] = useState();


    const getImageFromHash = () => {
        var formData = new FormData();
        formData.append("hash", id);
        setIsLoading(true);
        axios({
            method: "post",
            url: "/api/image/",
            data: formData,
        })
        .then(function (response) {
            setCurrentImage(response.data.image);
        })
        .catch(function (response) {
            setIsLoading(false);
      });
    }

    useEffect(()=> {
        getImageFromHash();
    },[])

    const handleCopy = () => {
        enqueueSnackbar("Image copied to clipboard successfully!", {
          autoHideDuration: 2000,
          resumeHideDuration: 0,
          variant: "Success",
        });
        copy(rootUrl + "image/" + currentImage.image);
      };

    return (
        <PageTemplate>
            <Container maxWidth="sm">
                <Box sx={{height: "100vh", alignItems: 'center'}}>
                    <Card style={{justifyContent: 'center'}}>
                        <CardActionArea
                        onClick={() => {
                            handleCopy();
                        }}>
                            <ImageListItem >
                                <img src={publicUrl + id} />
                                {currentImage.caption && <ImageListItemBar title={currentImage.caption} />}
                            </ImageListItem>
                        </CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {currentImage.user_full_name}
                            </Typography>
                          <Divider/>
                            <Typography variant="body2" color="text.secondary">
                                Date Uploaded : {currentImage.date_uploaded}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>               
            </Container>
        </PageTemplate>
    )
}