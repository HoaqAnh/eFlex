import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId =
  "169551551152-d80vo21jesjv7r78qlbn3or3bo0nur08.apps.googleusercontent.com";
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

reportWebVitals();