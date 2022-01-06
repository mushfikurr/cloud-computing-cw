import { useState, useEffect } from "react";
import { ImageList, Typography, Fade, ImageListItem, CircularProgress, ImageListItemBar } from "@mui/material";
import { publicUrl } from "./CommonURLs";
import { useNavigate } from "react-router-dom";
import { SendTimeExtensionOutlined } from "@mui/icons-material";

export const CustomImageList = (props) => {
    const currentSelectedImages = props.currentSelectedImages;
    const setCurrentSelectedImages = props.setCurrentSelectedImages;
    const navigate = useNavigate();

    const renderImage = (image) => {
        const caption = props.isAlbum ? image.title : image.caption
        if (currentSelectedImages && currentSelectedImages.includes(image.id)) {
            return (
                <img
                    src={image.image ? publicUrl + image.image : "https://singlecolorimage.com/get/ffffff/200x200"}
                    alt={caption}
                    sx={props.indivSx}
                    loading="lazy"
                    style={{ border: "solid 2px #bb86fc" }}
                />
            );
        } else {
            return (
                <img src={image.image ? publicUrl + image.image : "https://singlecolorimage.com/get/ffffff/200x200"} alt={caption} sx={props.indivSx} loading="lazy" />
            );
        }
    };

    const handleClick = (imageid) => {
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

    const renderImageCaption = (image) => {
        if (props.isAlbum) {
            return <ImageListItemBar title={image.title} style={ props.captionFullHeight && {height: "100%" } } />
        }else if (image.caption) {
            return <ImageListItemBar title={image.caption} style={ props.captionFullHeight && {height: "100%" } } />
        }
    }

    const message = () => {
        if (props.isAlbum) {
            return "There are no albums to display."
        }else{
            return "There are no images to display."
        }
    }

    return (
        <>
        {props.currentImages && !props.isLoading && props.currentImages.length < 1 && <Typography variant="body2">{message()}</Typography>} 
        { props.isLoading && <CircularProgress />}
        <ImageList cols={props.cols ? props.cols : 6} gap={props.gaps ? props.gaps : 0} sx={props.sx}>
            {props.currentImages && props.currentImages.map((image, index) => {
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
                        if (props.isEditing) {
                            handleClick(image.id);
                        }else{
                            if (props.navigateToImage) {
                                navigate("/image/" + image.image); 
                            } else if (props.isAlbum) {
                                props.handleAlbum(image);
                            }
                        }
                    }}
                    style={{ cursor: "pointer"}}
                    >
                        {renderImage(image)}
                        {renderImageCaption(image)}
                    </ImageListItem>
                </Fade>
                );
            })}
            { props.children }
        </ImageList>
        </>
    )
}