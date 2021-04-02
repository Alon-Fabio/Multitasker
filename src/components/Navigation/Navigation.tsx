import React from "react";
import PropTypes from "prop-types";
import ProfileIcon from "../Profile/ProfileIcon";

interface NavProps {
  onRouteChange(route: string): void;
  isSignedIn: boolean;
  toggleModal(): void;
}

const Navigation: React.FC<NavProps> = ({
  onRouteChange,
  isSignedIn,
  toggleModal,
}) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signin")}
          className="f3 link dim underline pa3 pointer"
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange("register")}
          className="f3 link dim underline pa3 pointer"
        >
          Register
        </p>
      </nav>
    );
  }
};

Navigation.propTypes = {
  onRouteChange: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  isSignedIn: false,
};
export default React.memo(Navigation);
