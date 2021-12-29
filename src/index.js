import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./utils/UserProvider";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const theme = createTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
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
          <App />
        </UserProvider>
      </SnackbarProvider>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
