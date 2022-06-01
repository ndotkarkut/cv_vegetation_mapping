import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React from "react";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 40.800121192192144,
  lng: -73.95796098841262,
};

const options = {
  disableDefaultUI: false,
};

export default React.memo(function Map({ children }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    id: "google-map-script",
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={19}
      center={center}
      options={options}
    >
      {children}
    </GoogleMap>
  ) : (
    <></>
  );
});
