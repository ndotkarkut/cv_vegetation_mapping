import React from "react";
import { FaLocationArrow } from "react-icons/fa";
import styles from "./PanoCompass.module.css";

export default function PanoCompass({ panoId, marker, userHeading }) {
  const [enlarged, setEnlarged] = React.useState(false);
  const rotation = -45 + +userHeading;
  console.log(rotation);

  return (
    <div
      className={
        enlarged ? `${styles.container} ${styles.enlarged}` : styles.container
      }
      onClick={() => setEnlarged(!enlarged)}
    >
      <img
        src={`http://localhost:8888/${panoId}/depth_svg.svg`}
        className={
          enlarged ? `${styles.compass} ${styles.enlarged}` : styles.compass
        }
      />
      <FaLocationArrow
        color="red"
        size={20}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
        className={
          enlarged ? `${styles.arrow} ${styles.enlarged}` : styles.arrow
        }
      />
    </div>
  );
}
