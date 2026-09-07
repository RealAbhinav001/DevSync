import "aws-amplify/auth/enable-oauth-listener";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";

import "./index.css";
import { AuthProvider } from "./context/authProvider.jsx";
import App from "./App.jsx";

import amplifyConfig from "./amplifyConfig";

Amplify.configure(amplifyConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);