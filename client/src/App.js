import React, { useCallback, useEffect, useRef, useState } from "react";
import MapMarker from "./components/MapMarker";
import PromptMarker from "./components/PromptMarker";
import axios from "axios";
import "./App.css";

// for axios
// https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&pano=JOQ5ZqMNZLACIxUpaSP43w&heading=-45&pitch=42&fov=110&key=AIzaSyD-ikgPFc5SxFFSrLf1N3UB7RFhgrwy-SU

import {
  GoogleMap,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import RangeSlider from "./components/RangeSlider";

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

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [panoInfo, setPanoInfo] = useState([]);
  const [panoRef, setPanoRef] = useState();
  const [newMarkerPositions, setNewMarkerPositions] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [panoVisible, setPanoVisible] = useState(false);

  const [panoLat, setPanoLat] = useState(0);
  const [panoLng, setPanoLng] = useState(0);
  const [panoHeading, setPanoHeading] = useState(0);
  const [panoId, setPanoId] = useState("");
  const [markers, setMarkers] = useState([]);
  const [headingWasChanged, setHeadingWasChanged] = useState(false);
  const [showPromptMarker, setShowPromptMarker] = useState(false);
  const [zoom, setZoom] = useState(3);
  const mapRef = useRef();
  const markerRef = useRef();

  const [figureToShow, setFigureToShow] = useState();
  const [showFigure, setShowFigure] = useState(false);
  const [showSaveMarkerPositionPopup, setShowSaveMarkerPositionPopup] =
    useState(false);
  const [links, setLinks] = useState([]);
  const [pov, setPov] = useState([]);

  useEffect(() => {
    if (uploaded) {
      setTimeout(() => {
        setUploaded(false);
      }, 3000);
    }
  }, [uploaded]);

  const getTileUrl = (pano) => {
    console.log(pano);
    const curPano = markers.filter((marker) => pano === marker.id);
    console.log(curPano);
    if (curPano.length === 0) return null;
    return curPano[0].intensity;
  };

  useEffect(() => {
    if (!panoRef || markers.length === 0) return;

    // panoRef.setPano(markers[markers.length - 1].id);
    panoRef.registerPanoProvider((pano) => getCustomPanorama(pano, markers));
  }, [markers]);

  const getCustomPanorama = (pano, markers) => {
    setPanoVisible(true);
    console.log(panoRef.getLinks());
    console.log(markers);
    const curPano = markers.filter((marker) => pano === marker.id);
    console.log(curPano);
    if (curPano.length === 0) return null;
    console.log(curPano);

    if (pano === curPano[0]?.id) {
      console.log("here");
      return {
        location: {
          pano: curPano[0].id,
          description: "Custom Intensity Pano Image",
          pov: pov,
        },
        links: links,
        // The text for the copyright control.
        copyright: "Imagery (c) 2010 Google",
        // The definition of the tiles for this panorama.
        tiles: {
          tileSize: new window.google.maps.Size(2048, 1024),
          worldSize: new window.google.maps.Size(2048, 1024),
          // The heading in degrees at the origin of the panorama
          // tile set.
          centerHeading: 0,
          // getTileUrl: getTileUrl,
          getTileUrl: getTileUrl,
        },
      };
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!window.google || !window.google.maps) {
        return;
      }

      const panorama = await new window.google.maps.StreetViewPanorama(
        // document.getElementById("street-view")
        document.getElementById("marker-1"),
        {
          visible: true,
          linksControl: true,
          panControl: true,
          enableCloseButton: true,
        }
      );

      if (panoId) {
        panorama.setPano(panoId);
        panorama.setPov({ heading: panoHeading, pitch: 0 });
      } else {
        setTimeout(() => {
          panorama.setPano(panoId);
          panorama.setPov({ heading: panoHeading, pitch: 0 });
        }, 1000);
      }

      panorama.registerPanoProvider((pano) => getCustomPanorama(pano, markers));
      setPanoRef(panorama);
      window.google.maps.event.addListener(
        panorama,
        "pano_changed",
        function () {
          // console.log(panorama.getPhotographerPov());
          // console.log(panorama.getPano());
          if (initialized) {
            setPanoVisible(true);
          } else {
            setInitialized(true);
          }
          setPanoId(panorama.getPano());
          setPanoHeading(panorama.getPhotographerPov().heading);
          setHeadingWasChanged(true);
          setShowFigure(false);
        }
      );
      window.google.maps.event.addListener(
        panorama,
        "visible_changed",
        function () {
          console.log("visiblity now: ", !panoVisible);
          setPanoVisible(false);
          setShowFigure(false);
        }
      );
      window.google.maps.event.addListener(
        panorama,
        "links_changed",
        function (e) {
          console.log(e);
        }
      );
      window.google.maps.event.addListener(
        panorama,
        "position_changed",
        function (e) {
          console.log("position", panorama);
          setLinks(panorama.links);
          setPanoLat(panorama.location.latLng.lat());
          setPanoLng(panorama.location.latLng.lng());
          setPov(panorama.pov);
        }
      );

      setTimeout(() => {
        // window.google.maps.event.trigger(panorama, "pano_changed");
        // window.google.maps.event.trigger(panorama, "pano_changed");
      }, 3000);
    };

    fetchData();
  }, [mapRef.current, window.google, markerRef.current, markers]);

  const showFigureHandler = (idx) => {
    // import panoFigure from `./assets/figures/${panoId}.png`;
    // const panoFigure = require(`./assets/figures/${panoId}.png`).default;
    // setFigureToShow(panoFigure);
    setPanoVisible(true);
    setPanoLat(markers[idx].position.lat);
    setPanoLng(markers[idx].position.lng);
    panoRef.setPano(markers[idx].id);
    setFigureToShow(markers[idx].figures);
    setShowFigure(true);
    console.log(markers[idx].id);
  };

  const onMarkerMovedHandler = (panoId, lat, lng) => {
    setShowSaveMarkerPositionPopup(true);
    const newPanoInfo = { panoId, location: { lat, lng } };

    const curMarkerPositions = [...newMarkerPositions];
    const markerPositions = curMarkerPositions.filter(
      (pano) => pano.panoId !== panoId
    );

    const newestMarkerPositions = [...markerPositions, newPanoInfo];

    setNewMarkerPositions(newestMarkerPositions);
  };

  const submitNewPositionsHandler = async () => {
    setUploading(true);
    const response = await Promise.all(
      newMarkerPositions.map(async (marker, idx) => {
        return await axios.put(`http://localhost:4444/${marker.panoId}`, {
          location: marker.location,
        });
      })
    );

    setNewMarkerPositions([]);
    setUploading(false);
    setUploaded(true);
  };

  const rightClickHandler = async (e) => {
    // window.google.maps.event.trigger(panorama, "pano_changed");
    // console.log(panoRef);
    setFigureToShow();
    panoRef.setPosition({ lat: e.latLng?.lat(), lng: e.latLng?.lng() });
    panoRef.setPov(panoRef.getPhotographerPov());
    // console.log(e.latLng.lat(), e.latLng.lng());
    setPanoLat(e.latLng?.lat());
    setPanoLng(e.latLng?.lng());
    setShowPromptMarker(true);
  };

  const onClickHandler = async () => {
    panoRef.panoProvider.provider = null;
    console.log(panoRef.pov, panoRef.panoProvider.options);
    console.log(panoRef);

    const {
      data: { message, svg, figures, intensity },
    } = await axios.get(
      `http://localhost:8888/${panoRef.getPano()}?lat=${panoLat}&lng=${panoLng}&heading=${panoHeading}&zoom=${zoom}`
    );

    // console.log(message);
    // console.log(svg);
    // console.log(figures);
    const markerToAdd = {
      id: panoId,
      position: {
        lat: panoLat,
        lng: panoLng,
      },
      svg,
      figures,
      intensity: `http://localhost:8888/${panoId}_intensity_img.png`,
    };
    console.log(markerToAdd);

    setMarkers((curMarkers) => [...curMarkers, markerToAdd]);
    setFigureToShow(figures);
    setShowPromptMarker(false);
    panoRef.setPano(panoId);
  };

  // console.log(newMarkerPositions);
  if (loadError) {
    return "Error loading maps";
  }
  if (!isLoaded) {
    return "Loading maps";
  }

  // console.log(panoId, panoLat, panoLng, panoHeading);

  console.log(panoVisible);
  console.log("markers", markers);
  return (
    <div style={{ maxWidth: "100vw", overflow: "hidden" }}>
      <GoogleMap
        ref={mapRef}
        mapContainerStyle={mapContainerStyle}
        zoom={19}
        center={center}
        options={options}
        onRightClick={rightClickHandler}
        onClick={() => showPromptMarker && setShowPromptMarker(false)}
        streetView={panoRef}
      >
        {markers.map((pano, idx) => (
          <MapMarker
            iconSvg={pano.svg}
            key={idx}
            position={pano.position}
            panoId={pano.id}
            onClick={() => showFigureHandler(idx)}
            onMarkerMoved={onMarkerMovedHandler}
          />
        ))}
        {showPromptMarker && (
          <PromptMarker
            position={{ lat: panoLat, lng: panoLng }}
            onClick={onClickHandler}
          />
        )}
      </GoogleMap>
      <div
        id={`marker-1`}
        style={{
          position: "absolute",
          // width: "0vw",
          // height: "0vh",
          width: "100vw",
          height: "100vh",
          bottom: "0px",
          left: "0px",
          zIndex: panoVisible ? 1000 : -1,
        }}
      ></div>
      {showFigure && figureToShow && (
        <div
          style={{
            position: "absolute",
            width: "40vw",
            height: "40vh",
            top: "0px",
            left: "0px",
            zIndex: 1000,
            objectFit: "contain",
          }}
        >
          <img
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              backgroundColor: "white",
            }}
            src={figureToShow}
            alt="figure"
          />
          <p
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              fontSize: "36px",
              fontWeight: "bold",
              padding: "0px 10px",
              cursor: "pointer",
              margin: 0,
            }}
            onClick={() => setFigureToShow(null)}
          >
            x
          </p>
        </div>
      )}
      {showSaveMarkerPositionPopup && (
        <div
          className="save-marker-popup"
          style={{ cursor: uploaded ? "not-allowed" : "pointer" }}
          onClick={submitNewPositionsHandler}
        >
          <p>
            {uploading
              ? "UPLOADING..."
              : uploaded
              ? "UPLOADED!"
              : "SAVE NEW MARKER POSITIONS"}
          </p>
        </div>
      )}
      {panoVisible && figureToShow && (
        <div
          className="save-marker-popup"
          style={{
            cursor: uploaded ? "not-allowed" : "pointer",
            bottom: 175,
            left: 0,
            margin: "10px",
            zIndex: 1999,
          }}
          onClick={() => setShowFigure(!showFigure)}
        >
          <p>TOGGLE GREENERY DETAILS</p>
        </div>
      )}
      {panoVisible && (
        <div
          className="save-marker-popup"
          style={{
            cursor: uploaded ? "not-allowed" : "pointer",
            bottom: 100,
            left: 0,
            margin: "10px",
            zIndex: 1999,
          }}
          onClick={onClickHandler}
        >
          <p>GET INTENSITY IMAGE OF CURRENT PANORAMA</p>
        </div>
      )}
      {panoVisible && <RangeSlider setCurrentValue={(val) => setZoom(val)} />}
    </div>
  );
};

export default App;
