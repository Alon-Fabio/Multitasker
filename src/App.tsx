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
import faceDetectPic from "./Style/images/face-detection.png";
import graphPic from "./Style/images/graph.png";
import { ClickEvent } from "tsparticles/dist/Options/Classes/Interactivity/Events/ClickEvent";

// True for production and false for dev (dev will start at the home screen, and not the signin screen)
if (false) {
  var stageOfBuild = {
    // route: "44.204.229.83",
    route: "https://multitasker.alonfabio.com",
    startPoint: "signin",
    isSignedIn: false,
  };
} else {
  stageOfBuild = {
    route: "http://localhost",
    startPoint: "signin",
    isSignedIn: false,
    // Options: "faceDetection" the face detection section, "signin" sign in page, "signout" sign in page, "home" pick a mode (face detection/graph)
  };
}

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

  const [stage] = useState(stageOfBuild.route);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(stageOfBuild.isSignedIn);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<string>(() => {
    const routePersis = window.sessionStorage.getItem("SmartBrainRoute");

    if (routePersis) {
      return routePersis;
    }
    return "";
  });
  const [boxes, setBoxes] = useState<IBoxMap[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");
  const [SubmitTimeout, setSubmitTimeout] = useState(true);
  const [StyleTheme] = useState<IStyleTheme>(StyleThemeSetup);
  const [, setLoaded] = useState(false);

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
  // }, [stage, setLoading]);

  // A bug of typescript, the map raises an union error. forced to use *any* ↓
  const calculateFaceLocation = (data: Array<ICalculateFaceLocation>): any => {
    if (data !== undefined || typeof data["id"] === "number") {
      return data.map((face: ICalculateFaceLocation) => {
        const clarifaiFace = face.region_info.bounding_box;
        let image = document.getElementById(
          "inputimage"
        ) as HTMLImageElement | null;

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
      setBoxes(() => boxes);
    }
  };

  const onInputChange = (formInputUrl: string) => {
    setInput(formInputUrl);
    setImageUrl(formInputUrl);
    displayFaceBox([]);
  };

  const onButtonSubmit = () => {
    if (SubmitTimeout) {
      setSubmitTimeout(false);
      setTimeout(() => setSubmitTimeout(true), 3000);
      if (input !== "") {
        fetch(`${stage}/imageurl`, {
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
            if (response && response.status.code === undefined) {
              displayFaceBox([]);
              setImageUrl(
                "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
              );
            }
            if (response && response.status.code !== "10000") {
              setImageUrl(() => input);
              fetch(`${stage}/image`, {
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
                .catch((err) => {
                  console.error(err);
                });
            }
            displayFaceBox(
              calculateFaceLocation(response.outputs[0].data.regions)
            );
          })
          .catch((err) => {
            displayFaceBox([]);
            setImageUrl(
              "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
            );
            console.error(err);
          });
      } else {
        displayFaceBox([]);
        setImageUrl(
          "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
        );
      }
    }
  };

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
      {/* {isProfileOpen && (
        <Modal> */}
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
      {/* )} */}
      {route === "home" ? (
        <div id="LogoComponent" className="z-1 relative">
          <Logo
            image={faceDetectPic}
            context={"Face Detection"}
            onRouteChangeObj={{
              onRouteChange: onRouteChange,
              route: "faceDetection",
            }}
          />
          <Logo
            image={graphPic}
            context={"coming soon.."}
            onRouteChangeObj={{ onRouteChange: onRouteChange, route: "home" }}
          />
        </div>
      ) : route === "faceDetection" ? (
        <div className="face_detection z-1 relative">
          <Rank name={user.name} entries={user.entries} />
          {imageUrl ? (
            <FaceRecognition
              boxes={boxes}
              imageUrl={imageUrl}
              stage={stage}
              setLoaded={setLoaded}
            />
          ) : null}
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
        </div>
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
    </div>
  );
};

export default App;
