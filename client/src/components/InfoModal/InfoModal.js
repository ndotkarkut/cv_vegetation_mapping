import React, { useEffect, useState } from "react";
import Aframe from "../Aframe/Aframe";
import Modal from "../Modal/Modal";

const PlotDetailsTab = ({ percentages, figure, objectCount }) => {
  console.log(percentages);
  // colors
  const sky = percentages?.sky || null;
  const street = percentages?.street || null;
  const green = percentages?.green || null;
  // objects
  const bench = objectCount?.bench || null;
  console.log(bench);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "20px 0",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: 'column',
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: "8px 4px" }}>Panorama Analysis:</h1>
        <img
          style={{
            width: "100%",
            height: "auto",
            margin: "0px",
          }}
          src={figure}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "40%",
          height: "100%",
        }}
      >
        <h1 style={{ margin: "8px 4px" }}>Panorama Data:</h1>
        <h3 style={{ margin: "4px" }}>Color Detection</h3>
        {sky && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "500" }}
            >
              Sky:
            </p>
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "700" }}
            >
              {(sky * 100).toFixed(2)}%
            </p>
          </div>
        )}
        {green && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "500" }}
            >
              Street:
            </p>
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "700" }}
            >
              {(street * 100).toFixed(2)}%
            </p>
          </div>
        )}
        {street && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "500" }}
            >
              Greenery:
            </p>
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "700" }}
            >
              {(green * 100).toFixed(2)}%
            </p>
          </div>
        )}
        <div style={{ height: "25px" }} />
        <h3 style={{ margin: "4px" }}>Object Detection</h3>
        {bench && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "500" }}
            >
              Benches:
            </p>
            <p
              style={{ margin: "0 4px", fontSize: "1.1rem", fontWeight: "700" }}
            >
              {bench}
            </p>
          </div>
        )}
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
  objectCount,
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
          height: "450px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {activeTab === 1 && (
          <PlotDetailsTab
            percentages={percentages}
            figure={figure}
            objectCount={objectCount}
          />
        )}
        {activeTab === 2 && <IntensityTab intensityImage={intensityImage} />}
        {activeTab === 3 && <ObjectDetectionTab objectImage={objectImage} />}
      </div>
    </Modal>
  );
};

export default InfoModal;
