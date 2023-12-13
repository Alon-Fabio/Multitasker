import React from "react";
import Logo from "../../components/Logo/Logo";

// style
import "./home.css";
import { Link } from "react-router-dom";

interface IHome {
  faceDetectPic: string;
  graphPic: string;
}

const Home: React.FC<IHome> = ({ faceDetectPic, graphPic }) => {
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
        <Link to="faceDetection">
          <Logo image={faceDetectPic} context={"Face Detection"} />
        </Link>

        <Logo image={graphPic} context={"coming soon.."} />
      </div>
    </div>
  );
};

export default Home;
