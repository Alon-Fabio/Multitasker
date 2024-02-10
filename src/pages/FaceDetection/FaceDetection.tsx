import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
// style
import "./faceDetection.css";
// components
import Rank from "../../components/Rank/Rank";
import FaceRecognition from "../../components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "../../components/ImageLinkForm/ImageLinkForm";

// ============================================================== TypeScript ===============================================

type IFaceDetection = React.FC<{
  stage: string;

  entries: number;
  name: string;
  userId: number | null;
}>;

type TBoxMap = {
  leftCol: number;
  topRow: number;
  rightCol: number;
  bottomRow: number;
}[];

type TCalculateFaceLocation = {
  id: number;
  value: number;
  region_info: {
    bounding_box: {
      left_col: number;
      top_row: number;
      right_col: number;
      bottom_row: number;
    };
  };
}[];

interface IClarifyResponse {
  success: boolean;
  faces: {
    status: { code: string };
    data: TCalculateFaceLocation;
  };
}

interface IBoxErr {
  isError: boolean;
}

// ============================================= Component =============================================

const FaceDetection: IFaceDetection = ({ name, entries, userId, stage }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");
  const [faceEntries, setEntries] = useState<number | null>(
    Number(window.sessionStorage.getItem("multiProfile")) || null
  );
  const [boxes, setBoxes] = useState<TBoxMap>([]);
  const [fetchErr, setFetchErr] = useState("");
  const [SubmitTimeout, setSubmitTimeout] = useState(true);
  const [loaded, setLoading] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams({ image_url: "" });

  const FaceDetectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let queryUrl = searchParams.get("image_url");
    if (queryUrl?.length !== 0 && queryUrl) {
      queryUrl = encodeURI(queryUrl);

      setInput(queryUrl);
    }
  }, []);

  const displayFaceBox = (boxes: TBoxMap | IBoxErr): void => {
    if (Object.hasOwn(boxes, "isError")) {
      console.error("Failed to calculate face boxes");
    }
    if (Array.isArray(boxes)) {
      setBoxes(() => boxes);
    }
  };

  const onInputChange = (formInputUrl: string) => {
    if (imageUrl !== formInputUrl) {
      setInput(formInputUrl);
      setImageUrl(formInputUrl);
      displayFaceBox([]);
    }
  };

  const calculateFaceLocation = (
    clarifaiData: TCalculateFaceLocation
  ): TBoxMap | IBoxErr => {
    let image = document.getElementById(
      "inputimage"
    ) as HTMLImageElement | null;
    if (image === null || clarifaiData === undefined || clarifaiData === null)
      return { isError: true };
    const width = Number(image.offsetWidth);
    const height = Number(image.offsetHeight);
    if (clarifaiData !== undefined || clarifaiData !== null) {
      return clarifaiData.map((face: TCalculateFaceLocation[0]) => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return { isError: true };
  };

  const handleFailedAPICall = (message: string): void => {
    setFetchErr(message);
    setLoading(false);
    displayFaceBox([]);
    setImageUrl(
      "https://64.media.tumblr.com/39152183fc21b80af07e4c8146bc784b/tumblr_noqcsiGNIt1u7zqzwo1_500.gif"
    );
  };

  function onButtonSubmit() {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authentication: window.sessionStorage.getItem("SmartBrainToken") || "",
    };
    if (SubmitTimeout) {
      setSubmitTimeout(false);
      setTimeout(() => setSubmitTimeout(true), 3000);
      // Checking for empty url string.
      if (input === "" || input.indexOf("/") === -1) {
        handleFailedAPICall(
          "You need to add a picture's address in the bar under this line."
        );
        return;
      }
      console.info("looking for faces...");
      const controller = new AbortController();
      setTimeout(() => {
        if (loaded) {
          controller.abort();
          console.error("Server took too long to respond");
        }
      }, 10000);

      fetch(`${stage}/imageurl`, {
        method: "post",
        headers: headers,
        signal: controller.signal,
        body: JSON.stringify({
          input: input,
        }),
      })
        .then((response) => response.json())
        .then((response: IClarifyResponse) => {
          // Check for failed response.
          if (response.success == false) {
            handleFailedAPICall(
              "I'm sorry, Something went wrong.. Maybe try a different picture or try again later."
            );
          }
          if (
            response.faces?.status.code !== "10000" &&
            response.success == true
          ) {
            // Update user entries.
            fetch(`${stage}/image`, {
              method: "put",
              headers: headers,
              body: JSON.stringify({
                id: userId,
              }),
            })
              .then((response) => response.json())
              .then((userEntries) => {
                const isEntriesNumber = Number(userEntries);

                if (!Number.isNaN(isEntriesNumber)) {
                  window.sessionStorage.setItem(
                    "multiProfile",
                    `${isEntriesNumber}`
                  );

                  setEntries(isEntriesNumber);
                } else {
                  setFetchErr(
                    "Sorry, you're not logged in. please logout and back login."
                  );
                }
              })
              .catch((err) => {
                setFetchErr(
                  "Sorry, you're not logged in. please logout and back login."
                );
                console.error("Failed to update user with error: ", err);
              });
            // Update user entries end.
            // setSearchParams({ image_url: input });
            setImageUrl(input);

            displayFaceBox(calculateFaceLocation(response.faces.data));
            FaceDetectionRef.current?.classList.remove("displayNone");
          }
        })
        .catch((err) => {
          if (Boolean(imageUrl) && imageUrl.length > 0) {
            setFetchErr("Ops.. Maybe try a different picture");
          }

          console.error(err);
        });
    }
  }

  return (
    <div id="face_detection" className=" z-1 pa4 relative br4">
      <Rank
        name={name}
        entries={
          typeof faceEntries === "number"
            ? faceEntries.toString()
            : entries.toString()
        }
      />

      <h3>{fetchErr}</h3>
      <div ref={FaceDetectionRef}>
        <FaceRecognition boxes={boxes} imageUrl={input} />
      </div>

      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
    </div>
  );
};

export default FaceDetection;
