import React from "react";
import Tilt from "react-tilt";
import "./Logo.css";

/// <reference path="./types.d.ts"/>

interface ILogoProps {
  image: string;
  context: string;
  onRouteChangeObj: {
    onRouteChange(route: string): void;
    route: string;
  };
}

const Logo: React.FC<ILogoProps> = ({ image, context, onRouteChangeObj }) => {
  return (
    <div
      className="mt4 mb4 mt0 Logo"
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        onRouteChangeObj.onRouteChange(onRouteChangeObj.route)
      }
    >
      <h1>{context}</h1>
      <Tilt className="Tilt br4" options={{ max: -5, scale: 1.1, speed: 8000 }}>
        <div className="Tilt-inner pa3">
          <img alt="logo" src={image} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
