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


const FaceRecognition: React.FC<{ imageUrl: string; boxes: any }> = ({
  imageUrl,
  boxes,
}): JSX.Element => {
 
  return (
    <div >
    <div className="center">
    <img className="ma2"
          alt=""
          id="inputimage"
          src={imageUrl}
          width="500px"
          height="auto"
        />
      <div className="ma2 absolute block">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {boxes.map(
          (box: IBoxMap, i: number): JSX.Element => {
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
          }
        )}
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
