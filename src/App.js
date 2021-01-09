import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Modal from "./components/Modals/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";

const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const App = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    age: "",
    pet: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState("signin");
  const [boxes, setBoxes] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");

  const initialState = () => {
    setUser((prevState) => {
      return {
        ...prevState,
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
        age: "",
        pet: "",
      };
    });
    setIsProfileOpen(false);
    setIsSignedIn(false);
    setLoading(false);
    setRoute("signin");
    setBoxes([]);
    setImageUrl("");
    setInput("");
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("SmartBrainToken");
    if (token) {
      setLoading(() => true);
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
      })
        .then((data) => data.json())
        .then((data) => {
          if (data && data.id) {
            fetchProfile(token, data.id);
          } else {
            setLoading(() => false);
          }
        })
        .catch(console.log);
    } else {
      setLoading(() => false);
    }
  }, []);

  const fetchProfile = (token, id) => {
    fetch(`http://localhost:3000/profile/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authentication: token,
      },
    })
      .then((data) => data.json())
      .then((user) => {
        if (user.email) {
          loadUser(user);
          onRouteChange("home");
        }
      })
      .catch((err) => console.log);
  };

  const loadUser = (data) => {
    setUser((prevState) => {
      return {
        ...prevState,
        id: data.id,
        name: data.name,
        age: data.age,
        pet: data.pet,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      };
    });
  };

  const calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return;
  };

  const displayFaceBox = (boxes) => {
    if (boxes) {
      setBoxes(() => boxes);
    }
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(() => input);
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authentication: window.sessionStorage.getItem("SmartBrainToken"),
      },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authentication: window.sessionStorage.getItem("SmartBrainToken"),
            },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setUser((prevState) => {
                return { ...prevState, entries: count };
              });
            })
            .catch(console.log);
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      window.sessionStorage.removeItem("SmartBrainToken");
      return initialState();
    } else if (route === "home") {
      setIsSignedIn(() => true);
    }
    setRoute(() => route);
  };

  const toggleModal = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation
        isSignedIn={isSignedIn}
        onRouteChange={onRouteChange}
        toggleModal={toggleModal}
      />
      {isProfileOpen && (
        <Modal>
          <Profile
            isProfileOpen={isProfileOpen}
            loadUser={loadUser}
            toggleModal={toggleModal}
            user={user}
          />
        </Modal>
      )}
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        loading ? (
          <h1 className="f1 fw6 ph0 mh0">Loading</h1>
        ) : (
          <Signin
            loadUser={loadUser}
            onRouteChange={onRouteChange}
            fetchProfile={fetchProfile}
          />
        )
      ) : (
        <Register
          loadUser={loadUser}
          fetchProfile={fetchProfile}
          onRouteChange={onRouteChange}
        />
      )}
    </div>
  );
};

export default App;
