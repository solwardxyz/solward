import React from "react";
import { createRoot } from "react-dom/client";
import SolwardApp from "./SolwardApp.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SolwardApp />
  </React.StrictMode>
);
