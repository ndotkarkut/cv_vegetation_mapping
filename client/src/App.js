import React, { useRef, useState } from "react";
import { StreetViewPanorama } from "@react-google-maps/api";
import { API_URL } from "./constants/config";
import Map from "./components/Map/Map";
import axios from "axios";
import MapMarker from "./components/MapMarker";
import InfoModal from "./components/InfoModal/InfoModal";
import PanoCompass from "./components/PanoCompass/PanoCompass";
import RangeSlider from "./components/RangeSlider/RangeSlider";
import "./App.css";
import Modal from "./components/Modal/Modal";
import loader from "./assets/loader.gif";

export default function App() {
  const [pano, setPano] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [heading, setHeading] = useState(0);
  const [userHeading, setUserHeading] = useState(0);
  const [zoom, setZoom] = useState(3);
  const [fontSize, setFontSize] = useState(2);
  const [markers, setMarkers] = useState([]);
  const [figures, setFigures] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(
    !process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  );
  const [apiKey, setApiKey] = useState("");
  const [submittedApiKey, setSubmittedApiKey] = useState();

  const panoRef = useRef();

  const onClickHandler = async () => {
    setIsLoading(true);
    const {
      data: {
        message,
        svg,
        figures,
        intensity,
        percents,
        object_count,
        heading: resHeading,
      },
    } = await axios.get(
      `${API_URL}/${pano}?lat=${lat}&lng=${lng}&heading=${heading}&zoom=${
        zoom - 1
      }&fontSize=${fontSize}`
    );

    // console.log(message);
    // console.log(svg);
    // console.log(figures);
    // console.log("here");

    const markerToAdd = {
      id: pano,
      position: {
        lat,
        lng,
      },
      svg,
      figures,
      intensity: `${API_URL}/${pano}/pano_img_intensity.png`,
      processing: `${API_URL}/${pano}/processed/pano_img.jpg`,
      percents,
      objectCount: object_count,
      heading: resHeading,
    };
    // console.log(markerToAdd);

    setMarkers((curMarkers) => [...curMarkers, markerToAdd]);
    setFigures(figures);
    setIsLoading(false);
  };

  const getDetails = () => {
    const streetview = panoRef.current.state.streetViewPanorama;
    const pano = streetview.pano;
    const userHeading = streetview.pov.heading;
    const position = streetview.location.latLng;
    const lat = position.lat();
    const lng = position.lng();
    setUserHeading(userHeading);
    setPano(pano);
    setLat(lat);
    setLng(lng);
  };

  const getPhotographerHeading = () => {
    const streetview = panoRef.current.state.streetViewPanorama;
    console.log(streetview);
    const photographerHeading = streetview.getPhotographerPov()?.heading;
    !!photographerHeading && setHeading(photographerHeading);
  };

  const showPano = async (idx) => {
    const streetview = panoRef.current.state.streetViewPanorama;
    streetview.setPano(markers[idx].id);
    streetview.setVisible(true);
  };

  return (
    <div
      style={{
        maxWidth: "100vw",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {!!(process.env.REACT_APP_GOOGLE_MAPS_API_KEY || submittedApiKey) && (
        <Map
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || submittedApiKey}
        >
          <StreetViewPanorama
            ref={panoRef}
            onPovChanged={function () {
              console.log("onPovChanged");
              getDetails();
              // getPhotographerHeading();
            }}
            onVisibleChanged={function () {
              console.log("onVisibleChanged");
              setVisible(!visible);
              getPhotographerHeading();
            }}
            onPositionChanged={function () {
              console.log("onPositionChanged");
              getDetails();
              getPhotographerHeading();
            }}
            onPanoChanged={function () {
              console.log("onPanoChanged");
              getDetails();
              getPhotographerHeading();
            }}
          />
          {!visible &&
            markers.map((pano, idx) => (
              <MapMarker
                iconSvg={pano.svg}
                key={idx}
                position={pano.position}
                panoId={pano.id}
                onClick={() => showPano(idx)}
              />
            ))}
        </Map>
      )}
      {visible && (
        <div>
          {markers.filter(({ id }) => pano === id).length > 0 && (
            <PanoCompass
              panoId={pano}
              marker={markers.filter(({ id }) => pano === id)[0]}
              userHeading={userHeading}
            />
          )}
          {figures && markers.filter(({ id }) => pano === id).length > 0 && (
            <div
              className="save-marker-popup"
              style={{
                cursor: "pointer",
                bottom: 220,
                left: 0,
                margin: "10px",
                zIndex: 1999,
              }}
              onClick={() => {
                const marker = markers.filter(({ id }) => pano === id);
                setFigures(marker[0].figures);
                setShowModal(true);
              }}
            >
              <p>TOGGLE GREENERY DETAILS</p>
            </div>
          )}
          <div
            className="save-marker-popup"
            style={{
              cursor: "pointer",
              bottom: 160,
              left: 0,
              margin: "10px",
              zIndex: 1999,
            }}
            onClick={onClickHandler}
          >
            <p>GET INTENSITY IMAGE OF CURRENT PANORAMA</p>
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
            initialValue={1}
            style={{ bottom: 0, left: 0 }}
            min={1}
            max={4}
            minTitle="Lower Quality"
            maxTitle="Higher Quality"
            title="Greenery Pano Resolution"
          />
        </div>
      )}
      <InfoModal
        show={showModal}
        close={() => setShowModal(false)}
        figure={figures}
        percentages={markers.filter(({ id }) => id == pano)[0]?.percents}
        intensityImage={markers.filter(({ id }) => id == pano)[0]?.intensity}
        objectImage={markers.filter(({ id }) => id == pano)[0]?.processing}
        objectCount={markers.filter(({ id }) => id == pano)[0]?.objectCount}
      />
      <Modal
        show={showAddApiKeyModal}
        close={() => setShowAddApiKeyModal(false)}
        allowClose={false}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "4rem",
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h1>
            Add Google Maps API Key to use the Vegetation Mapping Web App:{" "}
          </h1>
          <p>
            This software relies on the Google Maps software, accessed through
            their API. For more info, or to retrieve your API Key,{" "}
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
            >
              click here.
            </a>
          </p>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            onClick={() => {
              setSubmittedApiKey(apiKey);
              setShowAddApiKeyModal(false);
            }}
          >
            Submit
          </button>
        </div>
      </Modal>
      {isLoading && (
        <div className="loading_indicator">
          <img src={loader} className="loading__img" />
        </div>
      )}
    </div>
  );
}
