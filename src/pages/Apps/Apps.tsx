import React from "react";
import Logo from "../../components/Logo/Logo";

// style
import "./apps.css";
import { Link } from "react-router-dom";

interface IApps {
  faceDetectPic: string;
  graphPic: string;
}

const Apps: React.FC<IApps> = ({ faceDetectPic, graphPic }) => {
  return (
    <div id="Home" className="z-1 relative ">
      <div>
        <h1>
          Hi there, I'm working on new cool features that will soon be available
          here
        </h1>
        <h3>For now, please enjoy the face detection app</h3>
      </div>
      <div id="LogoComponent">
        <Link to="/faceDetection">
          <Logo image={faceDetectPic} title={"Face Detection"} />
        </Link>
        <a>
          <Logo image={graphPic} title={"coming soon.."} />
        </a>
      </div>
    </div>
  );
};

export default Apps;
