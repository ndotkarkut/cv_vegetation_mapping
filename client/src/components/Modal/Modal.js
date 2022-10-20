import React, { useRef } from "react";
import "./Modal.css";

const Modal = ({ show, close, children, allowClose }) => {
  const backdrop = useRef();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (
          e.target === backdrop.current &&
          (typeof allowClose === "undefined" ||
            (typeof allowClose === "boolean" && !!allowClose))
        ) {
          close();
        }
      }}
      ref={backdrop}
      className={show ? "modal__backdrop active" : "modal__backdrop"}
    >
      <div className={show ? "modal__modal active" : "modal__modal"}>
        {children}
        <i
          onClick={close}
          aria-hidden="true"
          className="modal__exit-icon fa fa-times"
        ></i>
      </div>
    </div>
  );
};

export default Modal;
