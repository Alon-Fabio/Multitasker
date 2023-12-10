import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalBase from "./components/Modals/Modal";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "tachyons";

const root = document.getElementById("root");
const modalRoot = document.getElementById("modal-root");
if (!root || !modalRoot) throw new Error("Failed to find the root element");
const bindRoot = createRoot(root);
const bindModalRoot = createRoot(modalRoot);

bindRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

bindModalRoot.render(
  <React.StrictMode>
    <ModalBase setShowModal={() => {}} showModal={false} children={<></>} />
  </React.StrictMode>
);

// ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(
//   <ModalBase setShowModal={() => {}} showModal={false} children={<></>} />,
//   document.getElementById("modal-root")
// );
registerServiceWorker();
