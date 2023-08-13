import React from "react";
import PropTypes from "prop-types";
import ProfileIcon from "../Profile/ProfileIcon";

interface IStyleTheme {
  color: string;
  backgroundColor?: string;
  links?: string;
}

interface NavProps {
  onRouteChange(route: string): void;
  isSignedIn: boolean;
  toggleModal(): void;
  StyleTheme: IStyleTheme;
}

const Navigation: React.FC<NavProps> = ({
  onRouteChange,
  isSignedIn,
  toggleModal,
  StyleTheme,
}) => {
  if (isSignedIn) {
    return (
      <nav>
        <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
      </nav>
    );
  } else {
    return (
      <nav className={`${StyleTheme.backgroundColor}`}>
        <p
          onClick={() => onRouteChange("signin")}
          className={`f3 link dim pa3 pointer ${StyleTheme.links}`}
        >
          Sign In
        </p>
        <p
          onClick={() => onRouteChange("register")}
          className={`f3 link dim pa3 pointer ${StyleTheme.links}`}
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
