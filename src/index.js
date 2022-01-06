import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./utils/UserProvider";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      500: "#bb86fc",
      main: "#bb86fc",
      contrastDefaultColour: "dark",
    },
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <SnackbarProvider
            maxSnack={3}
            iconVariant={{
              success: "✅",
              error: "✖️",
              warning: "⚠️",
              info: "ℹ️",
            }}
          >
          <UserProvider>
            <CssBaseline />
            <App />
          </UserProvider>
        </SnackbarProvider>
      
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
