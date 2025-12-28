import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./styles/style.css";
import App from "./app/App";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter basename="/webLab4">
            <App />
        </BrowserRouter>
    </Provider>
);
