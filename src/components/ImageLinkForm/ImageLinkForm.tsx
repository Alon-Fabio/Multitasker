import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ImageLinkForm.css";

interface IImageLinkFormProps {
  onInputChange(event: string): void;
  onButtonSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const ImageLinkForm: React.FC<IImageLinkFormProps> = ({
  onInputChange,
  onButtonSubmit,
}) => {
  const [ImageUrl, setImageUrl] = useState("");
  const [Dragged, setDragged] = useState(false);

  const handleDragEnter = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    // console.log("DragEnter");
    setDragged(true);
  };

  const handleDragLeave = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    // console.log("DragLeave");

    if (Dragged) {
      setTimeout(() => setDragged(false), 500);
    }
  };

  const handleDragOver = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    // console.log("DragOver");
    if (Dragged!) setDragged(true);
  };

  const handleDrop = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    // console.log("drop");
    setDragged(false);
    let targetElement = dragEvent.dataTransfer.getData("text/html");
    let dragImageSrc = new DOMParser()
      .parseFromString(targetElement, "text/html")
      .querySelector("img")?.src;
    if (typeof dragImageSrc === "string") {
      onInputChange(dragImageSrc);
      setImageUrl(dragImageSrc);
    }
  };

  return (
    <div className="pa2" onDragEnter={(event) => handleDragEnter(event)}>
      <div
        className={Dragged ? "drag-drop-zone" : "hidden"}
        onDrop={(event) => handleDrop(event)}
        onDragOver={(event) => handleDragOver(event)}
      >
        {/* <div className={"drag-drop-zone"}> */}
        <h1>Drag files here to upload</h1>
      </div>
      <div className="pa3">
        <h2>
          {
            "This Magic Brain will detect faces in your pictures. Give it a try!"
          }
        </h2>
        <h2>{"Try pasting in a url of a photo."}</h2>
      </div>
      <div className="center">
        <div className="imageForm center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-100 center"
            type="tex"
            onChange={(event) => onInputChange(event.target.value)}
            // value={ImageUrl !== "" && ImageUrl}
            placeholder={ImageUrl !== "" ? ImageUrl : "https//image.jpg/png"}
          />
          <button
            className="grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
      {/* <div className="relative"> */}
      <div
        onDragEnter={(event) => handleDragEnter(event)}
        onDragOver={(event) => handleDragOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        className="drag_detect"
      ></div>
      {/* </div> */}
    </div>
  );
};

ImageLinkForm.propTypes = {
  onButtonSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default ImageLinkForm;
