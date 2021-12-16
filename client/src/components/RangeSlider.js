import React, { useEffect, useState } from "react";

import "./RangeSlider.scss";

const RangeSlider = (props) => {
  const { setCurrentValue } = props;
  const [value, setValue] = useState(3);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "400px",
        height: "70px",
        backgroundColor: "black",
        border: "1px solid black",
        borderRadius: "15px",
        margin: "10px",
      }}
    >
      <div class="range-slider" style={{ width: "400px" }}>
        <div class="range-group" style={{ width: "100%" }}>
          <p style={{ margin: "5px", color: "white", width: "400px" }}>
            Greenery Pano Resolution: {value}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: "white", fontSize: "12px", paddingTop: "10px" }}>
              Lower Quality
            </p>
            <input
              class="range-input"
              id="location-range-slider"
              value={value}
              min="1"
              max="5"
              type="range"
              onInput={(e) => setValue(e.target.value)}
            />
            <p
              style={{
                color: "white",
                fontSize: "12px",
                paddingTop: "10px",
                textAlign: "end",
              }}
            >
              Higher Quality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
