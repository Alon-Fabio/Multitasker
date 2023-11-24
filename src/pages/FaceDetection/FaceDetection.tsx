import React, { useRef, useState } from "react";
// style
import "./faceDetection.css";
// components
import Rank from "../../components/Rank/Rank";
import FaceRecognition from "../../components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "../../components/ImageLinkForm/ImageLinkForm";
interface IUser {
  id: null | number;
  name: string | "";
  email: string | "";
  entries: number;
  joined: string | "";
  age: string | "";
  pet: string | "";
}
interface IFaceDetection {
  stage: string;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  user: IUser;
}

interface IBoxMap {
  leftCol: number;
  topRow: number;
  rightCol: number;
  bottomRow: number;
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

const FaceDetection: React.FC<IFaceDetection> = ({ user, setUser, stage }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");
  const [fetchErr, setFetchErr] = useState("");
  const [boxes, setBoxes] = useState<IBoxMap[]>([]);
  const [SubmitTimeout, setSubmitTimeout] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const FaceDetectionRef = useRef<HTMLDivElement | null>(null);

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

  const onButtonSubmit2 = () => {
    // Check for empty url string.
    console.log(input.indexOf("/"));
    if (input === "" || input.indexOf("/") === -1) {
      setFetchErr(
        "You need to add a picture's address in the bar under this line."
      );

      displayFaceBox([]);
      setImageUrl(
        "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
      );
      console.log("Got empty url.");
      return;
    }
    // Brute force gate.
    if (SubmitTimeout) {
      setSubmitTimeout(false);
      setTimeout(() => setSubmitTimeout(true), 3000);
      // Update user entries.
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
        .then((userCount) => {
          if (Number.isInteger(userCount)) {
            setUser((prevState) => {
              return { ...prevState, entries: userCount };
            });

            console.log("looking for faces");
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
                  setFetchErr("Ops.. Maybe try a different picture");

                  displayFaceBox([]);
                  setImageUrl(
                    "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
                  );
                }
                if (response && response.status.code !== "10000") {
                  setImageUrl(() => input);
                }
                FaceDetectionRef.current?.classList.remove("displayNone");
                displayFaceBox(
                  calculateFaceLocation(response.outputs[0].data.regions)
                );
              })
              .catch((err) => {
                if (imageUrl && imageUrl.length > 0) {
                  setFetchErr("Ops.. Maybe try a different picture");
                }

                console.error(err);
              });
          }
        })
        .catch((err) => {
          setFetchErr("Sorry, you're not logged in. please logout and login.");
          console.error("Failed to update user with error: ", err);
        });
    }
  };

  const onButtonSubmit = () => {
    if (SubmitTimeout) {
      setSubmitTimeout(false);
      setTimeout(() => setSubmitTimeout(true), 3000);
      // Check for empty url string.
      if (input === "" || input.indexOf("/") === -1) {
        setFetchErr(
          "You need to add a picture's address in the bar under this line."
        );

        displayFaceBox([]);
        setImageUrl(
          "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
        );
        console.log("Got empty url.");
        return;
      }
      console.log("looking for faces");
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
          console.log("Clarify data: ", response.faces);
          // Check for failed response.
          if (response.success == false) {
            setFetchErr(
              "I'm sorry, Something went wrong.. Maybe try a different picture or try again later."
            );
            console.log(response.error);
            displayFaceBox([]);
            setImageUrl(
              "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
            );
          }
          if (
            response.faces?.status.code !== "10000" &&
            response.success == true
          ) {
            console.log(
              "Response.success type: ",
              typeof response.success,
              "Val: ",
              response.success
            );
            setImageUrl(() => input);
            // Update user entries.
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
              .then((userEntries) => {
                if (Number.isInteger(userEntries)) {
                  setUser((prevState) => {
                    return { ...prevState, entries: userEntries };
                  });
                } else {
                  console.log("userEntries type is ", typeof userEntries);
                  setFetchErr(
                    "Sorry, you're not logged in. please logout and login."
                  );
                }
              })
              .catch((err) => {
                setFetchErr(
                  "Sorry, you're not logged in. please logout and login."
                );
                console.error("Failed to update user with error: ", err);
              });
            // Update user entries end.

            FaceDetectionRef.current?.classList.remove("displayNone");
            displayFaceBox(
              calculateFaceLocation(response.faces?.outputs[0].data.regions)
            );
          }
        })
        .catch((err) => {
          if (Boolean(imageUrl) && imageUrl.length > 0) {
            setFetchErr("Ops.. Maybe try a different picture");
          }

          console.error(err);
        });
    }
  };

  return (
    <div id="face_detection" className=" z-1 pa4 relative br4">
      <Rank name={user.name} entries={user.entries?.toString()} />

      <h3>{fetchErr}</h3>
      <div ref={FaceDetectionRef}>
        <FaceRecognition
          boxes={boxes}
          imageUrl={input}
          stage={stage}
          setLoaded={setLoaded}
        />
      </div>

      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
    </div>
  );
};

export default FaceDetection;
