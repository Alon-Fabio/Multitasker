import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

interface IProIcoProps {
  // onRouteChange(route: string): void;
  handleSignOut(): void;
  toggleModal(): void;
}

const ProfileIcon: React.FC<IProIcoProps> = ({
  // onRouteChange,
  handleSignOut,
  toggleModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="pa4 tc">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          {/* <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 pa1 ba b--black-10 h3 w3"
            alt="avatar"
          /> */}
          <i className="fa-solid fa-user  pointer b--black-10"></i>
        </DropdownToggle>
        <DropdownMenu
          right
          className="b--transparent shadow-5"
          style={{
            marginTop: "20px",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <DropdownItem onClick={toggleModal}>Profile</DropdownItem>
          <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

ProfileIcon.propTypes = {
  handleSignOut: PropTypes.func.isRequired,

  toggleModal: PropTypes.func.isRequired,
};

export default ProfileIcon;
