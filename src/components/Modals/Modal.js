import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";

const modalRoot = document.getElementById("modal-root");

const Modal = ({ children }) => {
  const [el, setEl] = useState(document.createElement("div"));
  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return ReactDOM.createPortal(children, el);
};

Modal.propTypes = {
  children: PropTypes.shape({
    $$typeof: PropTypes.symbol,
    key: PropTypes.number,
    props: PropTypes.object,
    type: PropTypes.func,
  }),
};
export default Modal;
