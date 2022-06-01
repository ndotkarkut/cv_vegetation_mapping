import React from "react";

const Dashboard = ({ figureToShow, markers, panoId }) => {
  return (
    <div>
      {figureToShow && markers.filter(({ id }) => panoId === id).length > 0 && (
        <div
          className="save-marker-popup"
          style={{
            cursor: uploaded ? "not-allowed" : "pointer",
            bottom: 175,
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
          bottom: 100,
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

      <RangeSlider setCurrentValue={(val) => setZoom(val)} />
    </div>
  );
};
