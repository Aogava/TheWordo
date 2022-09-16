import css from "./EnterImageButton.module.css";
import mainCSS from "../../../App.module.css"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addNewElement, OptimiseElementsPositions } from "../pagesSlice.js";

let haveElementsToSort = false;

const EnterImageButton = (props) => {
  // Sorts elements
  // useEffect(() => {
  //   if (haveElementsToSort) {
  //     debugger
  //     haveElementsToSort = false;
  //     dispatch(OptimiseElementsPositions());
  //   }
  // }, [haveElementsToSort])

  const dispatch = useDispatch();
  const imageEntered = event => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    const imageObj = new Image()

    reader.onload = event => {
      let target = document.querySelector("." + mainCSS["page-line__choosen"]);

      if (target) {
        const lineID = target.parentNode.getAttribute("lineid");
        imageObj.src = reader.result;
        imageObj.onload = event => {
          dispatch(addNewElement([{
            lineID,
            src: reader.result,
            width: imageObj.width,
            height: imageObj.height,
          }]));
          dispatch(OptimiseElementsPositions());
          // haveElementsToSort = true;
        }
      }
    }

    reader.readAsDataURL(imageFile);
  }

  return (
    <div className={css["tools__enter-image-container"]}>
      <input onChange={imageEntered} hidden type="file" id="enterImage" accept="image/*"></input>
      <label htmlFor="enterImage">Enter image</label>
    </div>
  )
}

export default EnterImageButton;