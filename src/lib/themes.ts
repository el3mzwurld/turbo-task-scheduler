import { createTheme } from "@mui/material";

export const tempoTheme = createTheme({
  palette: {
    primary: {
      main: "#F5F5F5",
      dark: "#ece9e9",
    },
    secondary: {
      main: "#506bcf",
    },
    text: {
      primary: "#131212",
      disabled: "#2b2b2bcc",
      secondary: "#fff",
    },
    background: {
      default: "white",
    },
    success: {
      main: "#97ec80",
      light: "#97ec80",
    },
  },

  typography: {
    fontFamily: "'DM Sans', 'sans-serif'",
  },
});
