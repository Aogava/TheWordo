import css from "./App.module.css";
// import BoldingTextButton from "./features/BoldingTextButton/BoldingTextButton.js";
import "./nullStyle.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeCurrentElementID, deleteElementsByID, addNewElement, OptimiseElementsPositions, CreateNewLine, SetElementWidthByID, DeleteChangedElementArrayByID } from "./features/Pages/pagesSlice.js";
import EnterImageButton from "./features/Pages/EnterImage/EnterImageButton.js";
import TextSizing from "./features/Pages/TextSizing/TextSizing.js";
import TextDecoration from "./features/Pages/TextDecoration/TextDecoration.js";
import TextAligning from "./features/Pages/TextAligning/TextAligning.js";

let haveElementsToSort = false;

function App(props) {
  const dispatch = useDispatch();
  const pagesWidth = useSelector(state => state.pagesInfo.pagesWidth);
  const pagesHeight = useSelector(state => state.pagesInfo.pagesHeight);
  const pagesHorizontalPadding = useSelector(state => state.pagesInfo.pagesHorizontalPadding);
  const pagesVerticalPadding = useSelector(state => state.pagesInfo.pagesVerticalPadding);
  const elementsToMeasure = useSelector(state => state.pagesInfo.previouslyChangedElementsID);
  // Measure width of elements and writes it in state
  useEffect(() => {
    if (elementsToMeasure.length >= 1) {
      elementsToMeasure.forEach(element => {
        const foundElement = document.querySelector(`li[elementid='${element}']`);
        const elementWidth = foundElement.offsetWidth;
        dispatch(SetElementWidthByID({
          lineID: foundElement.parentNode.getAttribute("lineid"),
          elementID: element,
          width: elementWidth,
        }))
        dispatch(DeleteChangedElementArrayByID(element))
      })
    }
  }, [elementsToMeasure.length])

  // Sorts elements
  useEffect(() => {
    if (haveElementsToSort) {
      haveElementsToSort = false;
      dispatch(OptimiseElementsPositions());
    }
  }, [haveElementsToSort])

  //Choosing element when clicked
  const changeElementID = event => {
    const target = event.target.closest("li");

    if (target) {
      const elementID = target.getAttribute("elementid");

      dispatch(changeCurrentElementID(elementID));
    }
  }

  //Choosing last element of line by click
  const chooseLineLastElement = event => {
    if (event.target.closest("li")) {
      return;
    }

    const target = event.target.closest("ul");

    if (target) {
      const elementID = target.lastElementChild.getAttribute("elementid");

      dispatch(changeCurrentElementID(elementID));
    }
  }

  let keysPressed = {}

  const keydownHandler = event => {
    keysPressed[event.key] = true;
    // Deletes elements
    if (event.code == "Backspace") {
      let target = document.querySelector("." + css["page-line__choosen"]);

      if (target) {
        if (!target.previousElementSibling && !target.parentElement.previousElementSibling) {
          return;
        }
        const elementID = target.getAttribute("elementid");
        const lineID = target.parentNode.getAttribute("lineid");

        dispatch(deleteElementsByID({ elementID, lineID }));
        haveElementsToSort = true;
      }
    }
    // Moves pointer left
    else if (event.code == "ArrowLeft") {
      let target = document.querySelector("." + css["page-line__choosen"]);

      if (target) {
        let elementID;
        if (target.previousElementSibling) {
          elementID = target.previousElementSibling.getAttribute("elementid");
          dispatch(changeCurrentElementID(elementID));
        }
        else if (target.parentElement.previousElementSibling &&
          target.parentElement.previousElementSibling.lastElementChild) {
          elementID = target.parentElement.previousElementSibling.lastElementChild.getAttribute("elementid");
          dispatch(changeCurrentElementID(elementID));
        }
      }
    }
    // Moves pointer right
    else if (event.code == "ArrowRight") {
      let target = document.querySelector("." + css["page-line__choosen"]);

      if (target) {
        let elementID;
        if (target.nextElementSibling) {
          elementID = target.nextElementSibling.getAttribute("elementid");
          dispatch(changeCurrentElementID(elementID));
        }
        else if (target.parentElement.nextElementSibling &&
          target.parentElement.nextElementSibling.firstElementChild) {
          elementID = target.parentElement.nextElementSibling.firstElementChild.getAttribute("elementid");
          dispatch(changeCurrentElementID(elementID));
        }
      }
    }
    // Pastes copied text 
    else if (keysPressed["Control"] && event.code == "KeyV") {
      const pasteTextArray = navigator.clipboard.readText().then(clipboard => {
        let target = document.querySelector("." + css["page-line__choosen"]);

        if (target) {
          // clipboard.split("").forEach(symbol => {

          //   const lineID = target.parentNode.getAttribute("lineid");

          //   dispatch(addNewSymbolElement({ lineID, content: symbol }));
          // })
          const lineID = target.parentNode.getAttribute("lineid");
          let elements = [];
          clipboard.split("").forEach(element => {
            elements.push({
              lineID,
              symbol: element,
            })
          })
          dispatch(addNewElement(elements));
          haveElementsToSort = true;
        }
      });
    }
    else if (keysPressed["Control"] && event.code == "KeyC") {
      let test = window.getSelection();
      let ranges = test.getRangeAt(0);
    }
    // Adds new line
    else if (event.code == "Enter") {
      event.preventDefault();
      let target = document.querySelector("." + css["page-line__choosen"]);

      if (target) {
        const lineID = target.parentNode.getAttribute("lineid");

        dispatch(CreateNewLine(lineID));
        haveElementsToSort = true;
      }
    }
    // Nullifies their actions
    else if (event.key == "Shift" || event.key == "Alt" || event.code == "Tab" || event.key == "Control") { }
    // Adds new text
    else {
      event.preventDefault();
      let target = document.querySelector("." + css["page-line__choosen"]);

      if (target) {
        const lineID = target.parentNode.getAttribute("lineid");

        dispatch(addNewElement([{ lineID, symbol: event.key }]));
        haveElementsToSort = true;
      }
    }
  }

  const keyupHandler = event => {
    delete keysPressed[event.key];
  }

  const GetPageContent = () => {
    const rawPageLinesContent = useSelector(state => state.pagesInfo.pages[state.pagesInfo.currentPage].lines);
    const currentElementID = useSelector(state => state.pagesInfo.currentElementId);

    const completedPageContent = rawPageLinesContent.map(line => {
      return (
        <ul key={line.id} lineid={line.id} className={css["page-line"]} onClick={chooseLineLastElement}>
          {
            line.content.map(element => {
              let finalElement;

              if (element.type == "symbol") {
                const style = {
                  fontSize: element.fontSize + "px",
                  fontFamily: element.fontName,
                  minHeight: element.fontSize + "px",
                  // outline: "1px solid black",
                }

                if (element.symbol == "") {
                  style.paddingRight = "2px";
                }
                else if (element.symbol == " ") {
                  style.paddingRight = (element.fontSize / 4) + "px";
                }

                finalElement = (
                  <li onClick={changeElementID} key={element.id} elementid={element.id} className={`${css["page-line__item"]} ${css["page-line__symbol"]}`} style={style}> {element.symbol} </li>
                )

                if (currentElementID == element.id) {
                  finalElement = (
                    // <input autoFocus key={element.id} elementid={element.id} maxLength="1" className={`${css["page-line__item"]} ${css["page-line__symbol"]} ${css["page-line__choosen"]}`} style={style} value={element.symbol} />
                    <li onClick={changeElementID} key={element.id} elementid={element.id} className={`${css["page-line__item"]} ${css["page-line__symbol"]} ${css["page-line__choosen"]}`} style={style}> {element.symbol} </li>
                  )
                }
              }
              else if (element.type == "image") {
                finalElement = (
                  <li onClick={changeElementID} key={element.id} elementid={element.id} className={`${css["page-line__item"]} ${css["page-line__image"]}`}>
                    <img src={element.imageSrc} width={element.width} height={element.height} alt="image" />
                  </li>
                )

                if (currentElementID == element.id) {
                  finalElement = (
                    <li onClick={changeElementID} key={element.id} elementid={element.id} className={`${css["page-line__item"]} ${css["page-line__image"]} ${css["page-line__choosen"]}`}>
                      <img src={element.imageSrc} width={element.width} height={element.height} alt="image" />
                    </li>
                  )
                }
              }
              // else if (element.type == "enter") {
              //   finalElement = (
              //     <li key={element.id} elementid={element.id} className={`${css["page-line__item"]} ${css["page-line__image"]}`}>
              //       <br />
              //     </li>
              //   )
              // }

              return finalElement;
            })
          }
        </ul>
      )
    })

    return completedPageContent;
  }

  return (
    <div className={css["App"]}>
      <header className={`${css['App__header']} ${css['tools']}`}>
        <EnterImageButton />
        <TextSizing />
        <TextDecoration />
        <TextAligning />
      </header >
      <div className={`${css['App__content']} ${css['pages']}`}>
        <div className={`${css['pages__item']}`} tabIndex={-1} onKeyDown={keydownHandler} onKeyUp={keyupHandler}
          style={{
            width: pagesWidth,
            height: pagesHeight,
            paddingLeft: pagesHorizontalPadding,
            paddingRight: pagesHorizontalPadding,
            paddingTop: pagesVerticalPadding,
            paddingBottom: pagesVerticalPadding,
          }}>
          {GetPageContent()}
        </div>
      </div>
    </div >
  );
}

export default App;
