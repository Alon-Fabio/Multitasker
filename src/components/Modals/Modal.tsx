// import { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import PropTypes from "prop-types";
// import "./Modal.css";

// const modalRoot: HTMLElement | null = document.getElementById("modal-root");

// const Modal: React.FC<React.ReactNode> = ({ children }) => {
//   const [el] = useState(document.createElement("div"));
//   useEffect(() => {
//     if (modalRoot) {
//       modalRoot.appendChild(el);
//     }
//     return () => {
//       if (modalRoot) {
//         modalRoot.removeChild(el);
//       }
//     };
//   }, [el]);

//   return ReactDOM.createPortal(children, el);
// };

// Modal.propTypes = {
//   children: PropTypes.shape({
//     $$typeof: PropTypes.symbol,
//     key: PropTypes.number,
//     props: PropTypes.object,
//     type: PropTypes.func,
//   }),
// };
// export default Modal;

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";

const Modal: React.FC<{
  children: React.ReactNode;
  setShowModal: React.Dispatch<boolean>;
  showModal: boolean;
  closeModalTimeOut?: number;
  clickOutSide?: boolean;
}> = ({
  children,
  setShowModal,
  showModal,
  closeModalTimeOut = null,
  clickOutSide = true,
}) => {
  const modalRoot: HTMLElement | null = document.getElementById("modal-root");
  const body: HTMLElement | null = document.getElementById("body");
  const [el] = useState(document.createElement(`div`));
  const outClick = useRef(el);
  const Paragraph = document.createElement("p");
  Paragraph.innerHTML = "Press <span>esc</span> to exit.";
  Paragraph.className = "esc_message fadeaway_delay";
  const [escP] = useState(Paragraph);

  el.className = "modal_container";

  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    },
    [setShowModal]
  );
  useEffect(() => {
    const handleOutsideClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent
    ) => {
      const { current } = outClick;
      if (current.childNodes[0] === e.target) {
        // console.log(current.childNodes[0], e.target);
        modalRoot?.classList.remove("modalRootActive");
        // Time for animation.
        // setTimeout(() => {
        setShowModal(false);
        // }, 1500);
      }
    };
    if (modalRoot && showModal) {
      modalRoot.classList.add("modalRootActive");
      document.addEventListener("keydown", (event) => handleEsc(event), false);
      body?.classList.add("modal-open");
      modalRoot.appendChild(el);
      modalRoot.appendChild(escP);

      if (typeof closeModalTimeOut === "number") {
        setTimeout(() => {
          setShowModal(false);
        }, closeModalTimeOut);
      }
    }
    if (clickOutSide) {
      outClick.current?.addEventListener(
        "click",
        (e) => handleOutsideClick(e),
        false
      );
    }
    return () => {
      if (modalRoot && modalRoot.hasChildNodes()) {
        modalRoot.classList.remove("modalRootActive");
        // Time for animation.
        // setTimeout(() => {
        body?.classList.remove("modal-open");

        modalRoot.removeChild(el);
        modalRoot.removeChild(escP);
        // }, 1500);
        document.removeEventListener(
          "keydown",
          (event) => handleEsc(event),
          false
        );
      }
      if (clickOutSide) {
        el.removeEventListener("click", (e) => handleOutsideClick(e), false);
      }
    };
  }, [
    showModal,
    setShowModal,
    el,
    modalRoot,
    escP,
    clickOutSide,
    closeModalTimeOut,
    handleEsc,
    body,
  ]);

  return ReactDOM.createPortal(children, el);
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  setShowModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
export default Modal;
