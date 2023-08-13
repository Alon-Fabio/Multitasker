import * as React from "react";
import * as PropTypes from "prop-types";
import "./FaceRecognition.css";

interface IProps {
  imageUrl: string;
  boxes: {
    leftCol: number;
    topRow: number;
    rightCol: number;
    bottomRow: number;
  }[];
}
interface IBoxMap {
  topRow: number;
  leftCol: number;
  rightCol: number;
  bottomRow: number;
}

const FaceRecognition: React.FC<{
  imageUrl: string;
  boxes: any;
  stage: string;
  setLoaded: (b: boolean) => void;
}> = ({ imageUrl, boxes, setLoaded }): JSX.Element => {
  return (
    <div>
      <div className="center">
        <div className="pa2 relative block">
          <img
            onLoad={() => setLoaded(true)}
            id="inputimage"
            alt=""
            src={imageUrl}
            height={"max-content"}
          />
          {boxes.map((box: IBoxMap, i: number): JSX.Element => {
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
  stage: PropTypes.string.isRequired,
};

export default FaceRecognition;
