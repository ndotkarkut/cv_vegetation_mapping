import React from "react";
import "aframe";

const Aframe = ({ image }) => {
  return (
    <a-scene embedded style={{ height: "324px", width: "576px" }}>
      <a-assets>
        <img id="background" crossOrigin="anonymous" src={image} />
      </a-assets>
      <a-sky id="image-360" radius="1000" material={"src: #background"}></a-sky>
    </a-scene>
  );
};

export default Aframe;
