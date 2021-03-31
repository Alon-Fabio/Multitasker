import React from "react";
import Tilt from "react-tilt";
import "./Logo.css";

/// <reference path="./types.d.ts"/>

const Logo: React.FC<{
  image: string;
  context: string;
  setRoute: {
    setRoute(route: string): void;
    route: string;
  };
}> = ({ image, context, setRoute }) => {
  return (
    <div
      className="ma4 mt0"
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        setRoute.setRoute(setRoute.route)
      }
    >
      <h1>{context}</h1>
      <Tilt className="Tilt br4 shadow-2" options={{ max: 55 }}>
        <div className="Tilt-inner pa3">
          <img alt="logo" src={image} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
