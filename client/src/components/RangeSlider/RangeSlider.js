import React, { useEffect, useState } from "react";

import "./RangeSlider.scss";

const RangeSlider = ({
  setCurrentValue,
  style,
  min,
  max,
  minTitle,
  maxTitle,
  title,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue || Math.ceil(max / 2));

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div
      style={{
        position: "absolute",
        // bottom: 0,
        // left: 0,
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
        overflow: "hidden",
        zIndex: 1999,
        ...style,
      }}
    >
      <div className="range-slider" style={{ width: "400px" }}>
        <div className="range-group" style={{ width: "100%" }}>
          <p style={{ margin: "5px", color: "white", width: "400px" }}>
            {title}: {value}
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
              {minTitle}
            </p>
            <input
              className="range-input"
              id="location-range-slider"
              value={value}
              min={min}
              max={max}
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
              {maxTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
