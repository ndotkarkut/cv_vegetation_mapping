import React from "react";
import { FaLocationArrow } from "react-icons/fa";

export default function PanoCompass({ panoId, marker, userHeading }) {
  console.log("pano compass marker", +marker.heading);
  const heading = +marker.heading;

  const rotation = -45 + +userHeading;
  console.log(rotation)

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        right: 100,
        // margin: "10px",
        zIndex: 1999,
        height: "170px",
        width: "170px",
        borderRadius: "85px",
        backgroundColor: "white",
      }}
    >
      <img
        src={`http://localhost:8888/${panoId}/depth_svg.svg`}
        style={{
          height: "170px",
          width: "170px",
          objectFit: "center center",
        }}
      />
      <FaLocationArrow
        color="red"
        size={30}
        style={{
          transform: `rotate(${rotation}deg)`,
          position: "absolute",
          bottom: 72.5,
          right: 72.5,
        }}
      />
    </div>
  );
}
