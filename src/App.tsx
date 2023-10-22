import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";

import Navigation from "./components/Navigation/Navigation";
import Signin from "./pages/Signin/Signin";
import Register from "./pages/Register/Register";

import Modal from "./components/Modals/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";
import faceDetectPic from "./Style/images/face-detection.png";
import graphPic from "./Style/images/graph.png";
import Home from "./pages/Home/Home";
import FaceDetection from "./pages/FaceDetection/FaceDetection";

// True for production and false for dev (dev will start at the home screen, and not the signin screen)
if (false) {
  var stageOfBuild = {
    // route: "44.204.229.83", aws ipv4
    back: "https://multitasker.alonfabio.com",
    startPoint: "signin",
    isSignedIn: false,
  };
} else {
  stageOfBuild = {
    back: "http://localhost",
    startPoint: "signin",
    isSignedIn: false,
    // Options: "faceDetection" the face detection section, "signin" sign in page, "signout" sign in page, "home" pick a mode (face detection/graph)
  };
}

interface IStyleTheme {
  color: string;
  backgroundColor?: string;
  links?: string;
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

interface IUser {
  id: null | number;
  name: string | "";
  email: string | "";
  entries: string | "";
  joined: string | "";
  age: string | "";
  pet: string | "";
}

const App = () => {
  const [user, setUser] = useState<IUser>({
    id: null,
    name: "",
    email: "",
    entries: "0",
    joined: "",
    age: "",
    pet: "",
  });

  const StyleThemeSetup = {
    color: "light-blue",
    links: "lightest-blue",
    backgroundColor: "bg-navy",
  };

  const [stage] = useState(stageOfBuild.back);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(stageOfBuild.isSignedIn);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<string>(() => {
    const routePersis = window.sessionStorage.getItem("SmartBrainRoute");

    if (routePersis) {
      return routePersis;
    }
    return stageOfBuild.startPoint;
  });

  const [StyleTheme] = useState<IStyleTheme>(StyleThemeSetup);

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
  };

  const loadUser = (data: IUser): void => {
    setUser((prevState: IUser): IUser => {
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
    });
  };

  const onRouteChange = (route: string): void => {
    if (route === "signout") {
      window.sessionStorage.removeItem("SmartBrainToken");
      window.sessionStorage.removeItem("SmartBrainRoute");
      initialState();
    } else if (route === "home") {
      setIsSignedIn(() => true);
      window.sessionStorage.setItem("SmartBrainRoute", route);
    } else if (route === "faceDetection") {
      setRoute("faceDetection");
      window.sessionStorage.setItem("SmartBrainRoute", route);
    }
    window.sessionStorage.setItem("SmartBrainRoute", route);

    setRoute(() => route);
  };

  const fetchProfile = (token: string, id: number | null): void => {
    if (id !== null && id !== undefined) {
      fetch(`${stage}/profile/${id.toString()}`, {
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
            const routePersis =
              window.sessionStorage.getItem("SmartBrainRoute");
            setIsSignedIn(true);
            if (routePersis && route !== "signin") {
              onRouteChange(routePersis);
            } else {
              onRouteChange("home");
            }
          }
        })
        .catch((err) => console.error);
    }
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("SmartBrainToken");

    if (token) {
      setLoading(() => true);
      fetch(`${stage}/signin`, {
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
        .catch(console.error);
    } else {
      setLoading(() => false);
    }
  }, []);

  const toggleModal = (): void => {
    setIsProfileOpen((prevState) => !prevState);
  };

  return (
    <div className="App">
      <Navigation
        isSignedIn={isSignedIn}
        onRouteChange={onRouteChange}
        toggleModal={toggleModal}
        StyleTheme={StyleTheme}
      />

      {route === "home" ? (
        <Home
          onRouteChange={onRouteChange}
          faceDetectPic={faceDetectPic}
          graphPic={graphPic}
        />
      ) : route === "faceDetection" ? (
        <FaceDetection
          user={user}
          setUser={setUser}
          stage={stageOfBuild.back}
        />
      ) : route === "signin" ? (
        loading ? (
          <h1 className="f1 fw6 ph0 mh0">Loading</h1>
        ) : (
          <Signin
            onRouteChange={onRouteChange}
            fetchProfile={fetchProfile}
            stage={stage}
          />
        )
      ) : (
        <Register
          fetchProfile={fetchProfile}
          onRouteChange={onRouteChange}
          stage={stage}
        />
      )}
      <Particles className="particles" params={particlesOptions} />
      <Modal
        showModal={isProfileOpen}
        setShowModal={setIsProfileOpen}
        clickOutSide
      >
        <Profile
          loadUser={loadUser}
          toggleModal={toggleModal}
          user={user}
          stage={stage}
        />
      </Modal>
    </div>
  );
};

export default App;
