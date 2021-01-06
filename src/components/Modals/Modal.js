import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const modalRoot = document.getElementById("modal-root");

const Modal = (props) => {
  const [el, setEL] = useState(document.createElement("div"));
  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return ReactDOM.createPortal(props.children, el);
};
export default Modal;
