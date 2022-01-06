import { Collapse, Paper, Stack, IconButton, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";

export const EditBar = (props) => {
    return (
        <>
            <Stack direction="row" alignItems="center" sx={{ marginBottom: 1 }}>
                <Typography variant="h5">{props.heading}</Typography>
                <IconButton
                onClick={() => {
                    if (props.editStatus) {
                    props.setEditMode(false);
                    } else {
                    props.setEditMode(true);
                    }
                }}
                size="small"
                sx={{ marginLeft: 1 }}
                >
                {!props.editStatus ? (
                    <EditIcon fontSize="inherit" />
                ) : (
                    <CloseIcon fontSize="inherit" />
                )}
                </IconButton>
            </Stack>
            <Collapse in={props.editStatus} sx={{ marginBottom: "8px"}}>
                <Paper
                elevation={0}
                sx={{ padding: 1, backgroundColor: grey[900] }}
                >
                <Stack direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ paddingRight: "43px" }}>
                    { props.editPrompt }
                    </Typography>
                    <LoadingButton loading={props.onAction} onClick={() => {
                        props.onDelete();
                    }}
                    disableElevation variant="contained">
                    Delete
                    </LoadingButton>
                </Stack>
                </Paper>
        </Collapse>
        </>
    )
}