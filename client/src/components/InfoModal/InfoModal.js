import React, { useEffect, useState } from "react";
import Aframe from "../Aframe/Aframe";
import Modal from "../Modal/Modal";

const PlotDetailsTab = ({ percentages, figure }) => {
  console.log(percentages);
  const sky = percentages?.sky;
  const green = percentages?.green;
  const street = percentages?.street;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img
        style={{ width: "auto", height: "60%", margin: "auto" }}
        src={figure}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sky && <p>Percent Sky: {(sky * 100).toFixed(2)}%</p>}
        {green && <p>Percent Green: {(green * 100).toFixed(2)}%</p>}
        {street && <p>Percent Street: {(street * 100).toFixed(2)}%</p>}
      </div>
    </div>
  );
};

const IntensityTab = ({ intensityImage }) => {
  console.log(intensityImage);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Aframe image={intensityImage} />
    </div>
  );
};

const ObjectDetectionTab = ({ objectImage }) => {
  console.log(objectImage);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Aframe image={objectImage} />
    </div>
  );
};

const InfoModal = ({
  show,
  close,
  figure,
  percentages,
  intensityImage,
  objectImage,
}) => {
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    setActiveTab(1);
  }, [figure, percentages, intensityImage, objectImage]);

  return (
    <Modal show={show} close={close}>
      <div style={{ height: "50px", display: "flex" }}>
        <div
          id="tab-1"
          style={{
            height: "100%",
            width: `${100 / 3}%`,
            backgroundColor: activeTab === 1 ? "white" : "#aaa",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
            fontWeight: "600",
            color: activeTab === 1 ? "black" : "white",
            cursor: activeTab === 1 ? "default" : "pointer",
          }}
          onClick={() => setActiveTab(1)}
        >
          <p>Pano Details</p>
        </div>
        <div
          id="tab-2"
          style={{
            height: "100%",
            width: `${100 / 3}%`,
            backgroundColor: activeTab === 2 ? "white" : "#aaa",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
            fontWeight: "600",
            color: activeTab === 2 ? "black" : "white",
            cursor: activeTab === 2 ? "default" : "pointer",
          }}
          onClick={() => setActiveTab(2)}
        >
          <p>Intensity Pano</p>
        </div>
        <div
          id="tab-3"
          style={{
            height: "100%",
            width: `${100 / 3}%`,
            backgroundColor: activeTab === 3 ? "white" : "#aaa",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
            fontWeight: "600",
            color: activeTab === 3 ? "black" : "white",
            cursor: activeTab === 3 ? "default" : "pointer",
          }}
          onClick={() => setActiveTab(3)}
        >
          <p>Object Detection Pano</p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {activeTab === 1 && (
          <PlotDetailsTab percentages={percentages} figure={figure} />
        )}
        {activeTab === 2 && <IntensityTab intensityImage={intensityImage} />}
        {activeTab === 3 && <ObjectDetectionTab objectImage={objectImage} />}
      </div>
    </Modal>
  );
};

export default InfoModal;
