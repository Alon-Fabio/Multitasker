import React, { useReducer } from "react";
import PropTypes from "prop-types";
import "./Profile.css";

// ============================================= Types =================================================
type TProfile = React.FC<{
  user: IUser;
  profile: IProfile;
  toggleModal: () => void;
  loadUser: (user: IProfile & IUser) => void;
  stage: string;
}>;

interface IProfile {
  entries: number;
}

interface IUser {
  id: null | number;
  email: string | "";
  name: string | "";
  joined: string | "";
  age: string | "";
  pet: string | "";
}

interface IProState {
  name?: string;
  age?: string;
  pet?: string;
}

interface IProAction {
  type: "NAME_CHANGE" | "AGE_CHANGE" | "PET_CHANGE";
  payload: string;
}

// ============================================= Component =============================================
const Profile: TProfile = ({ user, loadUser, toggleModal, profile, stage }) => {
  const sessionEntries = window.sessionStorage.getItem("multiProfile");
  const entries = sessionEntries || profile.entries;
  const { name, age, pet } = user;
  const today = new Date();
  const isBirthday = today
    .toISOString()
    .slice(0, today.toISOString().indexOf("T"));

  const formReducer: React.Reducer<IProState, IProAction> = (
    ProState,
    action
  ) => {
    switch (action.type) {
      case "NAME_CHANGE":
        if (action.payload.length > 1)
          return { ...ProState, name: action.payload };
        return { ...ProState, name: name };
      case "AGE_CHANGE":
        return { ...ProState, age: action.payload };

      case "PET_CHANGE":
        return { ...ProState, pet: action.payload };
      default:
        return new Error("FormReducer type is not valid");
    }
  };

  const [ProState, dispatch] = useReducer(formReducer, {
    name: name,
    age: age,
    pet: pet,
  });

  const onProfileSave = (data: IProState) => {
    fetch(`${stage}/api/profile/${user.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authentication:
          window.sessionStorage.getItem("SmartBrainToken") || "no token",
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((response) => {
        if (response.status === 200 || response.status === 304) {
          toggleModal();
          loadUser({ ...profile, ...user, ...data });
        } else {
          alert("Something went wrong.. please try again later.");
        }
      })

      .catch(console.error);
  };

  return (
    <div className="profile-modal">
      <article className="overflow-y-auto ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
        <i id="profile_avatar" className="fa-solid fa-user b--black-10"></i>
        <div onClick={toggleModal} className="modal-close">
          &times;
        </div>
        <main className="pa4  w-80">
          <h1>{name || ProState.name}</h1>
          <h4>{`Image submitted: ${entries}`}</h4>
          <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
          <p>Date of birth: {age?.split(/-/).reverse().join("/")}</p>
          <p>{age === isBirthday ? "Happy birthday!" : ""}</p>
          <hr />

          <label className="mt2 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={name}
            type="text"
            name="user-name"
            id="name"
            onChange={(event) =>
              dispatch({
                type: "NAME_CHANGE",
                payload: event.target.value,
              })
            }
          />
          <label className="mt2 fw6" htmlFor="user-age">
            Date of birth:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={age || "immortal!"}
            type="date"
            name="user-age"
            id="age"
            max="2018-12-31"
            onChange={(event) =>
              dispatch({
                type: "AGE_CHANGE",
                payload: event.target.value,
              })
            }
          />

          <label className="mt2 fw6" htmlFor="pet-name">
            Pet:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={pet}
            type="text"
            name="pet-name"
            id="pet"
            onChange={(event) =>
              dispatch({
                type: "PET_CHANGE",
                payload: event.target.value,
              })
            }
          />

          <div
            className="mt4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button
              onClick={() => onProfileSave(ProState)}
              className="profile_btn b pa2 grow pointer hover-white w-40 b--black-20"
            >
              Save
            </button>
            <button
              className="profile_btn b pa2 grow pointer hover-white w-40  b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
      </article>
    </div>
  );
};

Profile.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,

  profile: PropTypes.shape({
    entries: PropTypes.number.isRequired,
  }).isRequired,
  /*  A bug between TS & PropType:
  "id: PropTypes.number !== id: number | null > id: PropTypes.number === id: number | null | undefined".
  PropType has no definition fo 'null' but 'isRequired' but that will also set 'undefined'. 
  */
  // @ts-ignore
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string.isRequired,
    joined: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    pet: PropTypes.string.isRequired,
  }).isRequired,
  stage: PropTypes.string.isRequired,
};

export default Profile;
