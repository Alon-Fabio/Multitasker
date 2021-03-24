import React from "react";
import PropTypes from "prop-types";
import "./ImageLinkForm.css";

interface IImageLinkFormProps {
  onInputChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onButtonSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const ImageLinkForm: React.FC<IImageLinkFormProps> = ({
  onInputChange,
  onButtonSubmit,
}) => {
  return (
    <div className="ma2 mh4">
      <p className="f3 b">
        {"This Magic Brain will detect faces in your pictures. Give it a try!"}
      </p>
      <p className="f3 b">{"Try pasting in a url of a photo."}</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="tex"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

ImageLinkForm.propTypes = {
  onButtonSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default ImageLinkForm;
