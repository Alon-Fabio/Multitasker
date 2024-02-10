import React from "react";
import PropTypes from "prop-types";
import "./FaceRecognition.css";
// ============================================================== TypeScript ===============================================

type IBoxMap = {
  topRow: number;
  leftCol: number;
  rightCol: number;
  bottomRow: number;
}[];

type TFaceRecognition = React.FC<{
  imageUrl: string;
  boxes: IBoxMap;
}>;
// ============================================================== Component ===============================================

const FaceRecognition: TFaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div>
      <div className="center">
        <div className="pa2 relative block">
          <img
            className="br3"
            id="inputimage"
            alt="Uploaded image"
            src={imageUrl}
            height={"max-content"}
          />
          {boxes.map((box: IBoxMap[0], i: number): JSX.Element => {
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
    </div>
  );
};

FaceRecognition.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  boxes: PropTypes.arrayOf(
    PropTypes.shape({
      leftCol: PropTypes.number.isRequired,
      topRow: PropTypes.number.isRequired,
      rightCol: PropTypes.number.isRequired,
      bottomRow: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
};

export default FaceRecognition;
