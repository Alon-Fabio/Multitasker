import React from "react";
import PropTypes from "prop-types";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />
        {boxes.map((box, i) => {
          return (
            <div
              key={i}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

FaceRecognition.propTypes = {
  imageUrl: PropTypes.string,
  boxes: PropTypes.arrayOf(
    PropTypes.shape({
      leftCol: PropTypes.number,
      topRow: PropTypes.number,
      rightCol: PropTypes.number,
      bottomRow: PropTypes.number,
    })
  ),
};

export default FaceRecognition;
