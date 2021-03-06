import React, { useReducer, useState } from "react";
import PropTypes, { number } from "prop-types";
import "./Profile.css";

interface IProfileProps {
  user: {
    id: null | number;
    name: string;
    email: string;
    entries: string;
    joined: string;
    age?: string;
    pet?: string;
  };
  toggleModal(): void;
  loadUser(user: {}): void;
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

const Profile: React.FC<IProfileProps> = ({ user, toggleModal, loadUser }) => {
  const [ageError, setAgeError] = useState(false);
  const { id, name, age, pet } = user;

  const formReducer: React.Reducer<IProState, IProAction> = (
    ProState,
    action
  ) => {
    switch (action.type) {
      case "NAME_CHANGE":
        return { ...ProState, name: action.payload };
      case "AGE_CHANGE":
        // @ts-ignore
        if (isNaN(action.payload) === false) {
          setAgeError(false);
          return { ...ProState, age: action.payload };
        } else {
          if (!ageError) {
            setAgeError(true);
          }
        }
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
    fetch(`http://localhost:3000/profile/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authentication:
          window.sessionStorage.getItem("SmartBrainToken") || "no token",
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((response: Response) => {
        if (response.status === 200 || response.status === 304) {
          toggleModal();
          loadUser({ ...user, ...data });
        } else {
          alert("Something went wrong.. please try again later.");
        }
      })

      .catch(console.log);
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="dib h3 w3"
            alt="avatar"
          />
          <h1>{ProState.name || name}</h1>
          <h4>{`Image submitted: ${user.entries}`}</h4>
          <p>{`Member since: ${new Date(
            user.joined || "Who are you?"
          ).toLocaleDateString()}`}</p>
          <hr />

          <label className="mt2 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={user.name}
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
            Age:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={age || "immortal!"}
            type="text"
            name="user-age"
            id="age"
            onChange={(event) =>
              dispatch({
                type: "AGE_CHANGE",
                payload: event.target.value,
              })
            }
          />
          {ageError ? (
            <p className="alert alert-warning">Age needs to be a number</p>
          ) : (
            <p></p>
          )}
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
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              onClick={() => onProfileSave(ProState)}
              className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
            >
              Save
            </button>
            <button
              className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
        <div onClick={toggleModal} className="modal-close">
          &times;
        </div>
      </article>
    </div>
  );
};

Profile.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    entries: PropTypes.string.isRequired,
    joined: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    pet: PropTypes.string.isRequired,
  }).isRequired,
};

export default Profile;
