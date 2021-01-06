import React, { useReducer } from "react";
import "./Profile.css";

const Profile = (props) => {
  const { user, toggleModal, loadUser } = props;
  const { id, name, age, pet } = user;

  const formReducer = (state, action) => {
    switch (action.type) {
      case "NAME_CHANGE":
        return { ...state, name: action.payload };
      case "AGE_CHANGE":
        return { ...state, age: action.payload };
      case "PET_CHANGE":
        return { ...state, pet: action.payload };
      default:
        return;
    }
  };

  const [state, dispatch] = useReducer(formReducer, {
    name: name,
    age: age,
    pet: pet,
  });

  const onProfileSave = (data) => {
    fetch(`http://localhost:3000/profile/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authentication: window.sessionStorage.getItem("SmartBrainToken"),
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((response) => {
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
          <h1>{state.name || name}</h1>
          <h4>{`Image submitted: ${user.entries}`}</h4>
          <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
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
              onClick={() => onProfileSave(state)}
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

export default Profile;
