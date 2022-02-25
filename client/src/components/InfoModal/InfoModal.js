import React from "react";
import Modal from "../Modal/Modal";

const InfoModal = ({ show, close, figure, percentages }) => {
  console.log(percentages);
  const sky = percentages?.sky;
  const green = percentages?.green;
  const street = percentages?.street;

  return (
    <Modal show={show} close={close}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: 'column'
        }}
      >
        <img
          style={{ width: "90%", height: "auto", margin: "auto" }}
          src={figure}
        />
        {sky && <p>Percent Sky: {(sky * 100).toFixed(2)}%</p>}
        {green && <p>Percent Green: {(green * 100).toFixed(2)}%</p>}
        {street && <p>Percent Street: {(street * 100).toFixed(2)}%</p>}
      </div>
    </Modal>
  );
};

export default InfoModal;
