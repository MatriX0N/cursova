import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";


const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: 'http://localhost:5173/' }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
