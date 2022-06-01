import React from "react";
import { Marker } from "@react-google-maps/api";

const MapMarker = ({ position, panoId, onClick }) => {
  if (!panoId || !position) {
    return null;
  }

  return (
    <Marker
      key={panoId}
      position={position}
      draggable={true}
      icon={{
        url: `http://localhost:8888/${panoId}/depth_svg.svg`,
        scaledSize: new window.google.maps.Size(175, 175),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(100, 100),
      }}
      id={panoId}
      onClick={onClick}
    />
  );
};

export default MapMarker;
