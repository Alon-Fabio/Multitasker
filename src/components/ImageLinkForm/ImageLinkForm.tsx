import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./ImageLinkForm.css";
// ============================================================== TypeScript ===============================================

type TImageLinkFormProps = React.FC<{
  onInputChange(event: string): void;
  onButtonSubmit(imageURL?: string): void;
}>;
// ============================================================== Component ===============================================

const ImageLinkForm: TImageLinkFormProps = ({
  onInputChange,
  onButtonSubmit,
}) => {
  const [ImageUrl, setImageUrl] = useState("");
  const dragZone = useRef<HTMLDivElement | null>(null);
  let isDragged = false;

  const handleDragEnterOrOver = (
    dragEvent: React.DragEvent<HTMLDivElement> | MouseEvent
  ) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    if (!isDragged) {
      isDragged = true;
      dragZone.current?.classList.add("drag_drop_zone");
    }
  };

  useEffect(() => {
    document
      .getElementById("body")
      ?.addEventListener(
        "dragenter",
        (event) => handleDragEnterOrOver(event),
        false
      );

    return () => {
      document.removeEventListener(
        "dragenter",
        (event) => handleDragEnterOrOver(event),
        false
      );
    };
  });

  const handleDragLeave = (dragEvent: React.DragEvent<HTMLDivElement>) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    isDragged = false;
  };

  const handleDrop = (
    dragEvent: React.DragEvent<HTMLDivElement> | DragEvent
  ) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    dragZone.current?.classList.remove("drag_drop_zone");

    let targetElement = dragEvent.dataTransfer?.getData("text/html");
    let dragImageSrc = new DOMParser()
      .parseFromString(targetElement ? targetElement : "", "text/html")
      .querySelector("img")?.src;
    if (typeof dragImageSrc === "string") {
      onInputChange(dragImageSrc);
      setImageUrl(dragImageSrc);
    }
  };

  return (
    <div className="pa2 ImageLinkForm">
      <div
        onDrop={(event) => handleDrop(event)}
        onDragOver={(event) => handleDragEnterOrOver(event)}
        onDragLeave={(event) => handleDrop(event)}
        ref={dragZone}
        className={"hidden"}
      >
        <h1>Drag & drop files here to upload</h1>
      </div>
      <div className="pa3">
        <h2>
          {
            "This Magic Brain will detect faces in your pictures. Give it a try!"
          }
        </h2>
        <h2>{"Try pasting in a url of a photo."}</h2>
      </div>
      <div className="center flex-column">
        <div className="imageForm pa4 br3 shadow-5">
          <input
            className="f4 pa2 br3 w-100 center"
            type="tex"
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={ImageUrl !== "" ? ImageUrl : "https//image.jpg/png"}
          />
        </div>
        <button
          className="grow ma3 br3 f4 link ph3 pv2 dib white"
          onClick={() => onButtonSubmit()}
        >
          Detect
        </button>
      </div>

      <div
        onDragEnter={(event) => handleDragEnterOrOver(event)}
        onDragOver={(event) => handleDragEnterOrOver(event)}
        onDragLeave={(event) => handleDragLeave(event)}
        className="drag_detect"
      ></div>
    </div>
  );
};

ImageLinkForm.propTypes = {
  onButtonSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default ImageLinkForm;
