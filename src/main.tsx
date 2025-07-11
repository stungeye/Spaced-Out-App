import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { LearnerProvider } from "./context/LearnerContext.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LearnerProvider>
          <App />
        </LearnerProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
