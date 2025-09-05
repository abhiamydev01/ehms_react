import ReactDOM from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/poppins"; // Default weight 400
import "@fontsource/poppins/600.css"; // Specific weight if needed
import { Toaster } from "react-hot-toast";
import "./App.css";
import App from "./App.jsx";

import "primereact/resources/themes/lara-light-cyan/theme.css";


import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <App />
                <Toaster position="top-right" reverseOrder={false} />
            </PrimeReactProvider>
        </BrowserRouter>
    </React.StrictMode>
);  
