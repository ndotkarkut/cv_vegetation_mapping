import { Marker } from "@react-google-maps/api";
import React from "react";
import PromptMarkerSvg from "../assets/prompt-marker.svg";

const PromptMarker = (props) => {
  const { position, onClick } = props;

  return (
    <Marker
      key={Math.floor(Math.random() * 100000)}
      position={position}
      icon={{
        url: PromptMarkerSvg,
        scaledSize: new window.google.maps.Size(100, 100),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(50, 50),
      }}
      onClick={onClick}
    />
  );
};

export default PromptMarker;
