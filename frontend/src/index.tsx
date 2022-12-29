import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <App />
            </NotificationProvider>
        </MoralisProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
