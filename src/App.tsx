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

interface ICalculateFaceLocation {
  id: string;
  value: number;
  region_info: {
    bounding_box: {
      left_col: number;
      top_row: number;
      right_col: number;
      bottom_row: number;
    };
  };
}

interface IBoxMap {
  leftCol: number;
  topRow: number;
  rightCol: number;
  bottomRow: number;
}

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
  interface IUser {
    id: null | number;
    name: string | "";
    email: string | "";
    entries: string | "";
    joined: string | "";
    age: string | "";
    pet: string | "";
  }

  const [user, setUser] = useState<IUser>({
    id: null,
    name: "",
    email: "",
    entries: "0",
    joined: "",
    age: "",
    pet: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState("signin");
  const [boxes, setBoxes] = useState<IBoxMap[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");

  const initialState = (): void => {
    setUser((prevState) => {
      return {
        ...prevState,
        id: null,
        name: "",
        email: "",
        entries: "0",
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

  const fetchProfile = (token: string, id: number | null): void => {
    if (id !== null) {
      fetch(`http://localhost:3000/profile/${id.toString()}`, {
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
    }
  };

  const loadUser = (data: IUser): void => {
    setUser(
      (prevState: IUser): IUser => {
        return {
          ...prevState,
          id: data.id,
          name: data.name,
          age: data.age || "",
          pet: data.pet || "",
          email: data.email,
          entries: data.entries,
          joined: data.joined,
        };
      }
    );
  };

  // A bug of typescript, the map raises an union error. forced to use *any* ↓
  const calculateFaceLocation = (data: Array<ICalculateFaceLocation>): any => {
    if (data !== undefined || typeof data["id"] === "number") {
      console.log(data);
      return data.map((face: ICalculateFaceLocation) => {
        const clarifaiFace = face.region_info.bounding_box;
        let image = document.getElementById("inputimage");
        if (image !== null) {
          const width = Number(image.offsetWidth);
          const height = Number(image.offsetHeight);
          return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - clarifaiFace.right_col * width,
            bottomRow: height - clarifaiFace.bottom_row * height,
          };
        } else return [data];
      });
    } else return [data];
  };

  const displayFaceBox = (boxes: IBoxMap[]): void => {
    if (boxes) {
      console.log("My boxes !!!", boxes);
      setBoxes(() => boxes);
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    if (input !== "") {
      setImageUrl(() => input);
      fetch("http://localhost:3000/imageurl", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authentication:
            window.sessionStorage.getItem("SmartBrainToken") || "",
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
                Authentication:
                  window.sessionStorage.getItem("SmartBrainToken") || "",
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
          displayFaceBox(
            calculateFaceLocation(response.outputs[0].data.regions)
          );
        })
        .catch((err) => console.log(err));
    } else {
      displayFaceBox([]);
      setImageUrl(
        "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
      );
    }
  };

  const onRouteChange = (route: string): void => {
    if (route === "signout") {
      window.sessionStorage.removeItem("SmartBrainToken");
      initialState();
    } else if (route === "home") {
      setIsSignedIn(() => true);
    }
    setRoute(() => route);
  };

  const toggleModal = (): void => {
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
          <Profile loadUser={loadUser} toggleModal={toggleModal} user={user} />
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
          <Signin onRouteChange={onRouteChange} fetchProfile={fetchProfile} />
        )
      ) : (
        <Register fetchProfile={fetchProfile} />
      )}
    </div>
  );
};

export default App;
