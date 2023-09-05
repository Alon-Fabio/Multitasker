import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalBase from "./components/Modals/Modal";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "tachyons";

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(
  <ModalBase setShowModal={() => {}} showModal={false} children={<></>} />,
  document.getElementById("modal-root")
);
registerServiceWorker();
