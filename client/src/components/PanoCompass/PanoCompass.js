import React from "react";
import { FaLocationArrow } from "react-icons/fa";
import styles from "./PanoCompass.module.css";

export default function PanoCompass({ panoId, marker, userHeading }) {
  const [enlarged, setEnlarged] = React.useState(false);
  const rotation = -45 + +userHeading;
  console.log(rotation);

  return (
    <div
      className={styles.container}
      onClick={() => setEnlarged(!enlarged)}
      style={enlarged ? { height: 500, width: 500, borderRadius: 250 } : {}}
    >
      <img
        src={`http://localhost:8888/${panoId}/depth_svg.svg`}
        className={styles.compass}
        style={enlarged ? { height: 500, width: 500 } : {}}
      />
      <FaLocationArrow
        color="red"
        size={20}
        style={{
          transform: `rotate(${rotation}deg)`,
          bottom: enlarged ? 240 : 115,
          right: enlarged ? 240 : 115,
        }}
        className={styles.arrow}
      />
    </div>
  );
}
