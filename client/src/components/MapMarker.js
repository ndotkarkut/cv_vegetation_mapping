import React, { useCallback, useEffect, useRef, useState } from "react";
import { Marker } from "@react-google-maps/api";

const MapMarker = (props) => {
  const { position, panoId, onClick, onMarkerMoved, iconSvg } = props;
  // const [markerRef, setMarkerRef] = useState();
  const [panoRef, setPanoRef] = useState();
  const [showPano, setShowPano] = useState(false);
  // const iconUrl = panoId && require(`../assets/svg/${panoId}.svg`).default;

  const markerRef = useRef();

  // const markerRef = useCallback(async (marker) => {
  //   // console.log(marker);
  //   if (!marker) {
  //     return;
  //   }
  //   return marker;
  //   // const panorama = await new window.google.maps.StreetViewPanorama(
  //   //   document.getElementById(`marker-1`),
  //   //   //   document.getElementById(`marker-${key}`),
  //   //   { visible: true, position: position }
  //   // );

  //   // setPanoRef(panorama);

  //   // if (showPano) {
  //   // window.google.maps.event.addListener(panorama, "pano_changed", function () {
  //   //   // console.log(panorama.getPhotographerPov());
  //   //   // console.log(panorama.getPano());
  //   //   if (showPano) {
  //   //     console.log(panorama.getPhotographerPov());
  //   //     console.log(panorama.getPano());
  //   //   }
  //   // });
  //   // // }
  //   // panorama.setPano("JOQ5ZqMNZLACIxUpaSP43w");
  //   // panorama.setPov({ heading: 180, pitch: 0 });
  //   // if (showPano) {
  //   //   console.log(panorama.getPosition().lat(), panorama.getPosition().lng());
  //   //   // console.log(panorama.getPov());
  //   //   console.log(panorama.getPhotographerPov());
  //   // }
  //   // setMarkerRef(marker);
  // });

  const onDragEndHandler = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onMarkerMoved(panoId, lat, lng);
  };

  if (!panoId || !position) {
    return null;
  }

  const onClickHandler = () => {
    onClick();
  };

  return (
    <Marker
      ref={markerRef}
      key={panoId}
      position={position}
      draggable={true}
      onDragEnd={onDragEndHandler}
      icon={{
        url: `http://localhost:8888/${panoId}/depth_svg.svg`,
        scaledSize: new window.google.maps.Size(200, 200),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(100, 100),
      }}
      id={panoId}
      onClick={onClickHandler}
    />
  );
};

export default MapMarker;
