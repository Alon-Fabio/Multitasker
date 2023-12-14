import React from "react";
import PropTypes from "prop-types";
import ProfileIcon from "../Profile/ProfileIcon";
import { Link } from "react-router-dom";

interface IStyleTheme {
  color: string;
  backgroundColor?: string;
  links?: string;
}

interface NavProps {
  // onRouteChange(route: string): void;
  handleSignOut(): void;
  isSignedIn: boolean;
  toggleModal(): void;
  StyleTheme: IStyleTheme;
}

const Navigation: React.FC<NavProps> = ({
  // onRouteChange,
  handleSignOut,
  isSignedIn,
  toggleModal,
  StyleTheme,
}) => {
  if (isSignedIn) {
    return (
      <nav>
        <ProfileIcon handleSignOut={handleSignOut} toggleModal={toggleModal} />
      </nav>
    );
  } else {
    return (
      <nav className={`${StyleTheme.backgroundColor}`}>
        <Link to="/signin">
          <p className={`f3 link dim pa3 pointer ${StyleTheme.links}`}>
            Sign In
          </p>
        </Link>
        <Link to="/register">
          <p className={`f3 link dim pa3 pointer ${StyleTheme.links}`}>
            Register
          </p>
        </Link>
      </nav>
    );
  }
};

Navigation.propTypes = {
  // onRouteChange: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  isSignedIn: false,
};
export default React.memo(Navigation);
