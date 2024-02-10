import React, { useState, useEffect, memo, useMemo } from "react";
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
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";

// ================================================================ is dev ? ===============================================
const isDev = false;
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

// ============================================================== TypeScript ===============================================

interface IStyleTheme {
  color: string;
  backgroundColor?: string;
  links?: string;
}

interface IUser {
  id: null | number;
  email: string | "";
  name: string | "";
  joined: string | "";
  age: string | "";
  pet: string | "";
}

interface IProfile {
  entries: number;
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
  const [userProfile, setUserProfile] = useState<IUser>({
    id: null,
    email: "",
    name: "",
    joined: "",
    age: "",
    pet: "",
  });
  const [appProfile, setAppProfile] = useState<IProfile>({
    entries: 0,
  });

  const navigate = useNavigate();

  // ====================================================================================================== remove ============================================================================
  // const [user, setUser] = useState<IUser>({
  //   id: null,
  //   name: "",
  //   email: "",
  //   entries: 0,
  //   joined: "",
  //   age: "",
  //   pet: "",
  // });

  // ====================================================================================================== remove ============================================================================

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
    setUserProfile((prevState) => {
      return {
        ...prevState,
        id: null,
        name: "",
        email: "",
        joined: "",
        age: "",
        pet: "",
      };
    });
    setAppProfile((prevState) => {
      return {
        ...prevState,
        entries: 0,
      };
    });
    setIsProfileOpen(false);
    setIsSignedIn(false);
    setLoading(false);
    navigate("signin");
    // setRoute("signin");
  };

  const loadUser = (data: IUser & IProfile): void => {
    setUserProfile((prevState: IUser): IUser => {
      return {
        ...prevState,
        email: data.email,
        id: data.id,
        name: data.name,
        age: data.age || "immortal? 🤯",
        pet: data.pet || "",
        joined: data.joined,
      };
    });
    setAppProfile((prvState) => {
      return {
        ...prvState,
        entries: Number(data.entries),
      };
    });
    window.sessionStorage.setItem("multiProfile", `${data.entries}`);
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem("SmartBrainToken");
    window.sessionStorage.removeItem("SmartBrainRoute");
    setInitialState();
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
            setIsSignedIn(true);
          }
        })
        .catch((err) => console.error);
    }
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("SmartBrainToken");

    if (
      token &&
      (userProfile.id === null || typeof userProfile.id !== "number")
    ) {
      isDev &&
        console.info(
          "App, useEffect: Type of id",
          userProfile.id,
          typeof userProfile.id
        );
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
            // ====================================================================================================== fetchProfile is navigating to rout apps, no need to do it twice ============================================================================
            fetchProfile(token, Number(data.id));

            // navigate("/apps");
            // ====================================================================================================== fetchProfile is navigating to rout apps, no need to do it twice ============================================================================
          } else {
            navigate("/signin");
            setIsSignedIn(false);
          }
        })
        .catch(console.error);
    } else {
      setLoading(() => false);
    }
  }, [userProfile.id]);

  const toggleModal = (): void => {
    setIsProfileOpen((prevState) => !prevState);
  };

  const updateEntries = (entries: number) => {
    setAppProfile((prvState) => {
      return { ...prvState, entries };
    });
  };

  const LayoutLoggedIn = () => {
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
            user={userProfile}
            toggleModal={toggleModal}
            profile={appProfile}
            stage={stage}
          />
        </Modal>
        <Outlet />
        <Particles className="particles" params={particlesOptions} />
      </div>
    );
  };

  const LayoutLoggedOut = () => {
    return (
      <div className="App">
        <Navigation
          isSignedIn={isSignedIn}
          // onRouteChange={onRouteChange}
          handleSignOut={handleSignOut}
          toggleModal={toggleModal}
          StyleTheme={StyleTheme}
        />
        <Outlet />
        <Particles className="particles" params={particlesOptions} />
      </div>
    );
  };
  // Split Navigation & components to singIn/notSignIng.

  return (
    <Routes>
      <Route path="*" element={<LayoutLoggedOut />}></Route>
      {isSignedIn ? (
        <Route path="*" element={<LayoutLoggedIn />}>
          <Route path="apps">
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
              path="faceDetection"
              element={
                <FaceDetection
                  userId={userProfile.id}
                  name={userProfile.name}
                  entries={appProfile.entries}
                  stage={stageOfBuild.back}
                />
              }
            />
          </Route>
        </Route>
      ) : (
        <Route path="*" element={<LayoutLoggedOut />}>
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
