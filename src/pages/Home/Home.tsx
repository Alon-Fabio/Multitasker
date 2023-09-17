import React from "react";
import Logo from "../../components/Logo/Logo";

// style
import "./home.css";

interface IHome {
  onRouteChange: (route: string) => void;
  faceDetectPic: string;
  graphPic: string;
}

const Home: React.FC<IHome> = ({ faceDetectPic, onRouteChange, graphPic }) => {
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
        <Logo
          image={faceDetectPic}
          context={"Face Detection"}
          onRouteChangeObj={{
            onRouteChange: onRouteChange,
            route: "faceDetection",
          }}
        />
        <Logo
          image={graphPic}
          context={"coming soon.."}
          onRouteChangeObj={{ onRouteChange: onRouteChange, route: "home" }}
        />
      </div>
    </div>
  );
};

export default Home;
