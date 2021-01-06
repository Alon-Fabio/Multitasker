import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "tachyons";
import Modal from "./components/Modals/Modal";

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Modal />, document.getElementById("modal-root"));
registerServiceWorker();
