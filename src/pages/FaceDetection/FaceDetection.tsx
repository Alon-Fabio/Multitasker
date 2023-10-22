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
  entries: string | "";
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

  const onButtonSubmit = () => {
    if (SubmitTimeout) {
      setSubmitTimeout(false);
      setTimeout(() => setSubmitTimeout(true), 3000);
      if (input === "") {
        setFetchErr("Ops.. Maybe try a different picture");

        displayFaceBox([]);
        setImageUrl(
          "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
        );
        console.log("no string");
        return;
      }
      console.log("fetch");
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
  };

  return (
    <div id="face_detection" className=" z-1 pa4 relative br4">
      <Rank name={user.name} entries={user.entries} />

      <h3>{fetchErr}</h3>
      <div ref={FaceDetectionRef}>
        <FaceRecognition
          boxes={boxes}
          imageUrl={imageUrl}
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
