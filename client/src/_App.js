import React, { useCallback, useEffect, useRef, useState } from "react";
import MapMarker from "./components/MapMarker";
import PromptMarker from "./components/PromptMarker";
import axios from "axios";
import "./App.css";

// for axios
// https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&pano=JOQ5ZqMNZLACIxUpaSP43w&heading=-45&pitch=42&fov=110&key=AIzaSyD-ikgPFc5SxFFSrLf1N3UB7RFhgrwy-SU

import {
  GoogleMap,
  Marker,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import RangeSlider from "./components/RangeSlider";
import { API_URL } from "./constants/config";
import InfoModal from "./components/InfoModal/InfoModal";
import PanoCompass from "./components/PanoCompass/PanoCompass";

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
  const [fontSize, setFontSize] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [panoInfo, setPanoInfo] = useState([]);
  const [panoRef, setPanoRef] = useState();
  const [newMarkerPositions, setNewMarkerPositions] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [panoVisible, setPanoVisible] = useState(false);
  const [panoShown, setPanoShown] = useState(false);
  const [userHeading, setUserHeading] = useState(0);

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

  const [benches, setBenches] = useState([]);

  useEffect(() => {
    if (uploaded) {
      setTimeout(() => {
        setUploaded(false);
      }, 3000);
    }
  }, [uploaded]);

  useEffect(() => {
    const fetchData = async () => {
      if (!window.google || !!initialized) {
        return;
      }
      console.log("initializing");

      const panorama = await new window.google.maps.StreetViewPanorama(
        // document.getElementById("street-view")
        document.getElementById("marker-1"),
        {
          visible: true,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
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

      // panorama.registerPanoProvider((pano) => getCustomPanorama(pano, markers));
      setPanoRef(panorama);
      window.google.maps.event.addListener(
        panorama,
        "pano_changed",
        function () {
          // console.log(panorama.getPhotographerPov());
          console.log(panorama.getPano(), panoId, !!panorama.getPano());

          setPanoId(panorama.getPano());
          if (!panorama.getPano()) return;

          if (!!panorama.getPano()) {
            setPanoVisible(true);
          } else {
            setInitialized(true);
          }
          setPanoHeading(panorama.getPhotographerPov().heading);
          setHeadingWasChanged(true);
          // setShowFigure(false);
        }
      );
      window.google.maps.event.addListener(
        panorama,
        "visible_changed",
        function () {
          console.log("visiblity now: ", !panoVisible);
          console.log("visibl changed", panorama.getPano(), panoId);

          if (!panoVisible) {
            setPanoId(panorama.getPano());
            setPanoVisible(true);
          } else {
            setPanoVisible(false);
            if (panorama.getPano() !== panoId) {
              return;
            } else {
              setPanoVisible(false);
            }
          }
          // setShowFigure(false);
        }
      );
      // window.google.maps.event.addListener(
      //   panorama,
      //   "links_changed",
      //   function (e) {
      //     console.log(e);
      //   }
      // );
      window.google.maps.event.addListener(
        panorama,
        "position_changed",
        function (e) {
          setPov(panorama.pov);
          setLinks(panorama.links);
          setPanoId(panorama.getPano());

          // console.log("position", panorama);

          // const panoIntensityImageIdx = markers.findIndex(({ id }) => id === panorama?.pano);
          // console.log(panoIntensityImageIdx);
          // if (panoIntensityImageIdx !== -1) {
          //   panoRef.setPano(markers[panoIntensityImageIdx].id);
          // }

          if (!!panorama.position) {
            setPanoLat(panorama.position.lat());
            setPanoLng(panorama.position.lng());
          } else if (!!panorama.location.latLng) {
            setPanoLat(panorama.location.latLng.lat());
            setPanoLng(panorama.location.latLng.lng());
          }
        }
      );
      window.google.maps.event.addListener(panorama, "pov_changed", () => {
        console.log("heading in event listener", panorama.getPov().heading);
        setUserHeading(panorama.getPov().heading);
      });

      setInitialized(true);

      setTimeout(() => {
        // window.google.maps.event.trigger(panorama, "pano_changed");
        // window.google.maps.event.trigger(panorama, "pano_changed");
      }, 3000);
    };

    fetchData();
  }, [mapRef.current, window.google, markerRef.current, markers]);

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
        return await axios.put(`${API_URL}/${marker.panoId}`, {
          location: marker.location,
        });
      })
    );
    //dsad
    setNewMarkerPositions([]);
    setUploading(false);
    setUploaded(true);
  };

  const onClickHandler = async () => {
    panoRef.setPosition({ lat: panoLat, lng: panoLng });
    panoRef.setPov(panoRef.getPhotographerPov());
    // panoRef.panoProvider.provider = null;
    // console.log(panoRef.pov, panoRef.panoProvider.options);
    // console.log(panoRef);

    const {
      data: {
        message,
        svg,
        figures,
        intensity,
        percents,
        object_count,
        heading,
      },
    } = await axios.get(
      `${API_URL}/${panoRef.getPano()}?lat=${panoLat}&lng=${panoLng}&heading=${panoHeading}&zoom=${zoom}&fontSize=${fontSize}`
    );

    // console.log(message);
    // console.log(svg);
    // console.log(figures);
    // console.log("here");

    const markerToAdd = {
      id: panoId,
      position: {
        lat: panoLat,
        lng: panoLng,
      },
      svg,
      figures,
      intensity: `${API_URL}/${panoId}/pano_img_intensity.png`,
      processing: `${API_URL}/${panoId}/processed/pano_img.jpg`,
      percents,
      objectCount: object_count,
      heading: heading,
    };
    // console.log(markerToAdd);

    setMarkers((curMarkers) => [...curMarkers, markerToAdd]);
    setBenches((curBenches) => [
      ...curBenches,
      ...object_count?.bench?.coordinates,
    ]);
    setFigureToShow(figures);
    setShowPromptMarker(false);
    panoRef.setPano(panoId);
  };

  const showPano = async (idx) => {
    panoRef.setPano(markers[idx].id);
    // panoRef.panoProvider.provider = null;
    // console.log(panoRef.pov, panoRef.panoProvider.options);
    // console.log(panoRef);
    setMarkers((curMarkers) => [...curMarkers]);
    // console.log(idx);
    panoRef.setPosition(markers[idx].position);
    panoRef.setPov(panoRef.getPhotographerPov());
    panoRef.setPano(markers[idx].id);
  };

  const newRightClickHandler = async (e) => {
    // console.log("right clicked", e);
    const curLat = await e.latLng.lat();
    const curLng = await e.latLng.lng();
    setPanoLat(curLat);
    setPanoLng(curLng);
    // setShowPromptMarker(true);
    // console.log("panoHeading", panoHeading);
    console.log("lat lng", curLat, curLng);

    // console.log(panoRef);
  };

  // console.log(newMarkerPositions);
  if (loadError) {
    return "Error loading maps";
  }
  if (!isLoaded) {
    return "Loading maps";
  }

  console.log(panoRef);

  return (
    <div style={{ maxWidth: "100vw", overflow: "hidden" }}>
      <GoogleMap
        ref={mapRef}
        mapContainerStyle={mapContainerStyle}
        zoom={19}
        center={center}
        options={options}
        // onRightClick={rightClickHandler}
        onRightClick={newRightClickHandler}
        onClick={() => showPromptMarker && setShowPromptMarker(false)}
        // streetView={panoRef}
      >
        <StreetViewPanorama
          ref={panoRef}
          onVisibleChanged={function () {
            console.log("visiblity now: ", !panoVisible, panoRef);
            // console.log("visibl changed", panoRef.current.getPano(), panoId);
            setPanoVisible(false);
            return;

            if (!panoVisible) {
              // setPanoId(panoRef.current.getPano());
              setPanoVisible(true);
            } else {
              // setPanoVisible(false);
              if (panoRef.current.getPano() !== panoId) {
                return;
              } else {
                setPanoVisible(false);
              }
            }
            // setShowFigure(false);
          }}
          onPovChanged={() => {
            console.log(
              "on pov changed",
              panoRef.current,
              panoRef.current.state.streetViewPanorama.pov
            );
            // console.log("heading in event listener", panorama.getPov().heading);
            // setUserHeading(panorama.getPov().heading);
          }}
          onPanoChanged={function () {
            // console.log(panorama.getPhotographerPov());
            console.log(
              // panoRef?.current?.getPano(),
              // panoId,
              // !!panoRef?.current?.getPano(),
              panoRef?.current
            );
            return;
            setPanoId(panoRef.current.getPano());
            if (!panoRef.current.getPano()) return;

            if (!!panoRef.current.getPano()) {
              // setPanoVisible(true);
            } else {
              setInitialized(true);
            }
            setPanoHeading(panoRef.current.getPhotographerPov().heading);
            setHeadingWasChanged(true);
            // setShowFigure(false);
          }}
        />
        {markers.map((pano, idx) => (
          <MapMarker
            iconSvg={pano.svg}
            key={idx}
            position={pano.position}
            panoId={pano.id}
            // onClick={() => showFigureHandler(idx)}
            onClick={() => showPano(idx)}
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
      {/* {panoVisible && <Dashboard />} */}
      {panoVisible && (
        <div>
          {markers.filter(({ id }) => panoId === id).length > 0 && (
            <PanoCompass
              panoId={panoId}
              marker={markers.filter(({ id }) => panoId === id)[0]}
              userHeading={userHeading}
            />
          )}
          {figureToShow &&
            markers.filter(({ id }) => panoId === id).length > 0 && (
              <div
                className="save-marker-popup"
                style={{
                  cursor: uploaded ? "not-allowed" : "pointer",
                  bottom: 220,
                  left: 0,
                  margin: "10px",
                  zIndex: 1999,
                }}
                onClick={() => {
                  const marker = markers.filter(({ id }) => panoId === id);
                  // console.log(marker[0]);
                  setFigureToShow(marker[0].figures);
                  // setShowFigure(!showFigure);
                  setShowModal(true);
                }}
              >
                <p>TOGGLE GREENERY DETAILS</p>
              </div>
            )}
          <div
            className="save-marker-popup"
            style={{
              cursor: uploaded ? "not-allowed" : "pointer",
              bottom: 160,
              left: 0,
              margin: "10px",
              zIndex: 1999,
            }}
            onClick={onClickHandler}
          >
            <p>GET INTENSITY IMAGE OF CURRENT PANORAMA</p>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              margin: "10px",
              top: "75px",
              cursor: "pointer",
              zIndex: 1999,
              height: "25px",
              width: "100px",
              backgroundColor: "#0088ff",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              justifySelf: "center",
              alignSelf: "center",
              display: "flex",
            }}
            onClick={() => setPanoVisible(false)}
          >
            <p>CLOSE</p>
          </div>
          <RangeSlider
            setCurrentValue={(val) => setFontSize(val)}
            initialValue={2}
            style={{ bottom: 80, left: 0 }}
            min={1}
            max={3}
            minTitle="Small"
            maxTitle="Large"
            title="Object Detection Font Size"
          />
          <RangeSlider
            setCurrentValue={(val) => setZoom(val)}
            initialValue={3}
            style={{ bottom: 0, left: 0 }}
            min={1}
            max={5}
            minTitle="Lower Quality"
            maxTitle="Higher Quality"
            title="Greenery Pano Resolution"
          />
        </div>
      )}
      <InfoModal
        show={showModal}
        close={() => setShowModal(false)}
        figure={figureToShow}
        percentages={markers.filter(({ id }) => id == panoId)[0]?.percents}
        intensityImage={markers.filter(({ id }) => id == panoId)[0]?.intensity}
        objectImage={markers.filter(({ id }) => id == panoId)[0]?.processing}
        objectCount={markers.filter(({ id }) => id == panoId)[0]?.objectCount}
      />
    </div>
  );
};

export default App;
