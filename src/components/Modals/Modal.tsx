import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";

const modalRoot: HTMLElement | null = document.getElementById("modal-root");

const Modal: React.FC<React.ReactNode> = ({ children }) => {
  const [el] = useState(document.createElement("div"));
  useEffect(() => {
    if (modalRoot) {
      modalRoot.appendChild(el);
    }
    return () => {
      if (modalRoot) {
        modalRoot.removeChild(el);
      }
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
