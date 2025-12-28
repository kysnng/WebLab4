import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {BrowserRouter, HashRouter} from "react-router-dom";
import "./styles/style.css";
import App from "./app/App";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
);
