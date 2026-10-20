import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TallerApp } from "./features/taller/TallerApp";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TallerApp />
  </StrictMode>
);
