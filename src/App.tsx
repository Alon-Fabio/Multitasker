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
import Apps from "./pages/Apps/Apps";
import FaceDetection from "./pages/FaceDetection/FaceDetection";
import {
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";

// ================================================================ is dev ? ===============================================
const isDev = true;
var stageOfBuild = {
  // route: "44.204.229.83", aws ipv4
  back: "https://multitasker.alonfabio.com",

  isSignedIn: false,
};

if (isDev) {
  stageOfBuild = {
    back: "http://localhost",

    isSignedIn: false,
    // Options: "faceDetection" the face detection section, "signin" sign in page, "signout" sign in page, "apps" pick a mode (face detection/graph)
  };
}
// ================================================================ is dev ? ===============================================
// ================================================================ is dev ? ===============================================

// ============================================================== TypeScript ===============================================

type TRoutes = "faceDetection" | "signin" | "register" | "apps";

interface IStyleTheme {
  color: string;
  backgroundColor?: string;
  links?: string;
}

interface IUser {
  id: null | number;
  name: string | "";
  email: string | "";
  entries: number;
  joined: string | "";
  age: string | "";
  pet: string | "";
}
// ============================================================ TypeScript end ==============================================

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
  const [user, setUser] = useState<IUser>({
    id: null,
    name: "",
    email: "",
    entries: 0,
    joined: "",
    age: "",
    pet: "",
  });
  const navigate = useNavigate();
  const routesNames: TRoutes[] = [
    "faceDetection",
    "signin",
    "register",
    "apps",
  ];
  const [route, setRoute] = useState("");
  const [stage] = useState(stageOfBuild.back);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(stageOfBuild.isSignedIn);
  const [loading, setLoading] = useState(false);
  const [StyleTheme] = useState<IStyleTheme>({
    color: "light-blue",
    links: "lightest-blue",
    backgroundColor: "bg-navy",
  });

  const setInitialState = () => {
    setUser((prevState) => {
      return {
        ...prevState,
        id: null,
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
    navigate("signin");
    // setRoute("signin");
  };

  const loadUser = (data: IUser): void => {
    setUser((prevState: IUser): IUser => {
      return {
        ...prevState,
        id: data.id,
        name: data.name,
        age: data.age || "immortal? 🤯",
        pet: data.pet || "",
        email: data.email,
        entries: Number(data.entries),
        joined: data.joined,
      };
    });
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem("SmartBrainToken");
    window.sessionStorage.removeItem("SmartBrainRoute");
    setInitialState();
  };
  // const onRouteChange = (route: string): void => {
  //   if (route === "signout") {
  //     window.sessionStorage.removeItem("SmartBrainToken");
  //     window.sessionStorage.removeItem("SmartBrainRoute");
  //     setInitialState();
  //   } else if (route === "apps") {
  //     setIsSignedIn(() => true);
  //     window.sessionStorage.setItem("SmartBrainRoute", route);
  //   } else if (route === "faceDetection") {
  //     setRoute("faceDetection");
  //     window.sessionStorage.setItem("SmartBrainRoute", route);
  //   } else if (route === "signin") {
  //     setRoute("signin");

  //     window.sessionStorage.setItem("SmartBrainRoute", route);
  //   }
  //   window.sessionStorage.setItem("SmartBrainRoute", route);

  //   setRoute(() => route);
  // };

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
            setIsSignedIn(true);
            // const routePersis =
            //   window.sessionStorage.getItem("SmartBrainRoute");
            //   if (routePersis && route !== "signin") {
            //     onRouteChange(routePersis);
            // } else {
            // onRouteChange("apps");
            navigate("/apps");
            // }
          }
        })
        .catch((err) => console.error);
    }
  };
  const isRoute = (route: string | null): boolean => {
    if (typeof route !== "string") false;
    return (
      ["faceDetection", "signin", "register", "apps"].find(
        (routeName) => routeName === route
      ) !== undefined
    );
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("SmartBrainToken");

    // const routePersis = window.sessionStorage.getItem("SmartBrainRoute");

    // if (
    //   routesNames.find((routeName) => routeName === routePersis) !==
    //     undefined &&
    //   routePersis !== null
    // ) {
    //   setRoute(routePersis);
    // } else {
    //   setRoute(stageOfBuild.startPoint);
    // }

    if (token && (user.id === null || typeof user.id !== "number")) {
      isDev &&
        console.log("App, useEffect: Type of id", user.id, typeof user.id);
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
          setLoading(() => false);
          if (data && data.id) {
            fetchProfile(token, Number(data.id));
            navigate("/apps");
          } else {
            navigate("/signin");
            setIsSignedIn(false);
          }
        })
        .catch(console.error);
    } else {
      setLoading(() => false);
    }
  }, [user.id]);

  const toggleModal = (): void => {
    setIsProfileOpen((prevState) => !prevState);
  };

  const Layout = () => {
    return (
      <div className="App">
        <Navigation
          isSignedIn={isSignedIn}
          // onRouteChange={onRouteChange}
          handleSignOut={handleSignOut}
          toggleModal={toggleModal}
          StyleTheme={StyleTheme}
        />
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
        <Outlet />
        <Particles className="particles" params={particlesOptions} />
      </div>
    );
  };

  // Split Navigation & components to singIn/notSignIng.
  // const router = createBrowserRouter([{}]);

  return (
    <Routes>
      <Route path="*" element={<Layout />}></Route>
      {isSignedIn ? (
        <Route path="*" element={<Layout />}>
          <Route
            path="*"
            index
            element={
              <Apps
                // onRouteChange={onRouteChange}
                faceDetectPic={faceDetectPic}
                graphPic={graphPic}
              />
            }
          />
          <Route
            path="FaceDetection"
            element={
              <FaceDetection
                user={user}
                setUser={setUser}
                stage={stageOfBuild.back}
              />
            }
          />
        </Route>
      ) : (
        <Route path="*" element={<Layout />}>
          <Route
            path="*"
            index
            element={
              <Signin
                // onRouteChange={onRouteChange}
                fetchProfile={fetchProfile}
                stage={stage}
              />
            }
          />

          <Route
            path="signin"
            index
            element={
              <Signin
                // onRouteChange={onRouteChange}
                fetchProfile={fetchProfile}
                stage={stage}
              />
            }
          />

          <Route
            path="register"
            element={
              <Register
                fetchProfile={fetchProfile}
                // onRouteChange={onRouteChange}
                stage={stage}
              />
            }
          />
        </Route>
      )}
    </Routes>
  );
};

export default App;
