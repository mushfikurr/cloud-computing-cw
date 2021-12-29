import { UserAppBar } from "../components/AppBar";
import { useParams } from "react-router-dom";
import { Container, ImageListItem, ImageListItemBar } from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { publicUrl } from "../components/CommonURLs";

export default function DisplayPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState({});

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
            console.log(response.data.image);
            setCurrentImage(response.data.image);
        })
        .catch(function (response) {
            console.log(response);
            setIsLoading(false);
      });
    }

    useEffect(()=> {
        getImageFromHash();
    },[])
    
    return (
        <>
            <UserAppBar />
            <NavBar />
            <Container justifyContent="center">
                <p>{currentImage.date_uploaded}</p>
                <p>{currentImage.user_full_name}</p>
                <ImageListItem>
                    <img src={publicUrl + id} />
                    {currentImage.caption && <ImageListItemBar title={currentImage.caption} />}
                  </ImageListItem>               
            </Container>
        </>
    )
}