import React from "react";
import { Tilt } from "react-tilt";
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

      <Tilt
        className="Tilt br4"
        options={
          {
            transition: true,
            max: 5,
            scale: 1.1,
            speed: 1,
            easing: "cubic-bezier(.87,.17,.53,.59)",
          }
          // {
          //   reverse: true, // reverse the tilt direction
          //   max: 5, // max tilt rotation (degrees)
          //   perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
          //   scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
          //   speed: 10000000, // Speed of the enter/exit transition
          //   transition: true, // Set a transition on enter/exit.
          //   axis: null, // What axis should be disabled. Can be X or Y.
          //   reset: true, // If the tilt effect has to be reset on exit.
          //   easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
          // }
        }
      >
        <div className="Tilt-inner pa3">
          <img alt="logo" src={image} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
