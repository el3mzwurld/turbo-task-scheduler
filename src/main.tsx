import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import App from "./App.tsx";
import { tempoTheme } from "./lib/themes.ts";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router/route.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={tempoTheme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
