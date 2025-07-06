import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { LearnerProvider } from "./context/LearnerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LearnerProvider>
        <App />
      </LearnerProvider>
    </BrowserRouter>
  </StrictMode>
);
