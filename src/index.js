import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Dapp } from "./components/Dapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import "./css/styles.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Dapp />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
