import { useState } from "react";
import { ImageList, Fade, ImageListItem, ImageListItemBar } from "@mui/material";

export const CustomImageList = (props) => {
    const [currentSelectedImages, setCurrentSelectedImages] = useState([]);

    const renderImage = (image) => {
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
            return <img src={publicUrl + image.image} alt={image.caption} loading="lazy" />;
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

    return (
        <ImageList cols={6} gap={0} sx={{ height: 575 }}>
            {props.currentImages.map((image, index) => {
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
                        if (isEditing) {
                            handleClick(image.id);
                        }else{
                            props.onClick();
                        }
                    }}
                    style={{ cursor: "pointer"}}
                    >
                    {renderImage(image)}
                    {image.caption && <ImageListItemBar title={image.caption} />}
                    </ImageListItem>
                </Fade>
                );
            })}
        </ImageList>
    )
}