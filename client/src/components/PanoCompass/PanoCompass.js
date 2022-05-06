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
        // bottom: 100,
        bottom: 50,
        right: 100,
        // margin: "10px",
        zIndex: 1999,
        height: "170px",
        width: "170px",
        borderRadius: "85px",
        height: "250px",
        width: "250px",
        borderRadius: "125px",
        backgroundColor: "white",
      }}
    >
      <img
        src={`http://localhost:8888/${panoId}/depth_svg.svg`}
        style={{
          height: "170px",
          width: "170px",
          height: "250px",
          width: "250px",
          objectFit: "center center",
        }}
      />
      <FaLocationArrow
        color="red"
        size={20}
        style={{
          transform: `rotate(${rotation}deg)`,
          position: "absolute",
          bottom: 115,
          right: 115,
        }}
      />
    </div>
  );
}
