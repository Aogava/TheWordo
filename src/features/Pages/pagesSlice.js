import { createSlice, nanoid } from "@reduxjs/toolkit";
import { useSelector, useStore } from "react-redux";

const initialState = {
  currentPage: 0,
  currentElementId: null,
  pagesWidth: 794,
  pagesHeight: 1123,
  pagesHorizontalPadding: 75,
  pagesVerticalPadding: 50,
  previouslyChangedElementsID: [],
  pages: [ // Pages
    { // Page
      id: nanoid(),
      lines: [
        { // Line
          id: nanoid(),
          aligned: "left",
          content: [
            { // Symbol
              id: nanoid(),
              type: "symbol",
              symbol: "",
              isBold: false,
              isItalic: false,
              isUnderlined: false,
              fontSize: 18,
              fontName: "Arial",
              color: "black",
              width: 0,
            },
            // { // Symbol
            //     id: nanoid(),
            //     type: "symbol",
            //     symbol: "F",
            //     isBold: false,
            //     isItalic: false,
            //     isUnderlined: false,
            //     fontSize: 18,
            //     fontName: "Arial",
            //     color: "black",
            // },
            // { // Symbol
            //     id: nanoid(),
            //     type: "symbol",
            //     symbol: " ",
            //     isBold: false,
            //     isItalic: false,
            //     isUnderlined: false,
            //     fontSize: 18,
            //     color: "black",
            // },
            // { // Symbol
            //     id: nanoid(),
            //     type: "symbol",
            //     symbol: "o",
            //     isBold: false,
            //     isItalic: false,
            //     isUnderlined: false,
            //     fontSize: 18,
            //     fontName: "Arial",
            //     color: "black",
            // },
            // { // Symbol
            //     id: nanoid(),
            //     type: "symbol",
            //     symbol: "r",
            //     isBold: false,
            //     isItalic: false,
            //     isUnderlined: false,
            //     fontSize: 18,
            //     fontName: "Arial",
            //     color: "black",
            // },
          ],
        },
        // {
        //   id: nanoid(),
        //   aligned: "left",
        //   content: [
        //     {
        //       id: nanoid(),
        //       type: "_enter",
        //       width: 0,
        //     },
        //     { // Symbol
        //       id: nanoid(),
        //       type: "symbol",
        //       symbol: "",
        //       isBold: false,
        //       isItalic: false,
        //       isUnderlined: false,
        //       fontSize: 18,
        //       fontName: "Arial",
        //       color: "black",
        //       width: 0,
        //     },
        //     { // Image
        //       id: nanoid(),
        //       type: "image",
        //       imageSrc: "./img/me and the boys.png",
        //       width: 200,
        //       height: 200,
        //     },
        //   ],
        // },
      ],
    },
  ],
}

const textSlice = createSlice({
  name: "pagesInfo",
  initialState,
  reducers: {
    changeCurrentElementID(state, action) {
      state.currentElementId = action.payload;
    },
    deleteElementsByID(state, action) {
      // action.payload = [
      //     {
      //         lineID: 1231,
      //         elementID: 13412,
      //     },
      //     {
      //         lineID: 1231,
      //         elementID: 13412,
      //     },
      //     {
      //         lineID: 1231,
      //         elementID: 13412,
      //     },
      // ]

      // action.payload.forEach(actionElement => {
      const necessaryLineIndex = state.pages[state.currentPage].lines.findIndex(line => {
        if (line.id == action.payload.lineID) {
          return true;
        }
      })

      let necessaryElementIndex;
      if (necessaryLineIndex != -1) {
        necessaryElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex].content.findIndex(element => {
          if (element.id == action.payload.elementID) {
            return true;
          }
        })
      }

      if (state.pages[state.currentPage].lines[necessaryLineIndex].content[necessaryElementIndex].symbol != "") {
        state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex, 1);
        // If previous element exist, then mark it
        if (necessaryElementIndex - 1 >= 0 &&
          state.pages[state.currentPage].lines[necessaryLineIndex].content.length > necessaryElementIndex - 1) {
          state.currentElementId = state.pages[state.currentPage].lines[necessaryLineIndex].content[necessaryElementIndex - 1].id;
        }
      }
      else {
        // If previous element don't exist, and previous line exist, then delete current line and mark last element of previous line 
        if (necessaryLineIndex - 1 >= 0 && state.pages[state.currentPage].lines.length > necessaryLineIndex - 1) {
          const lastElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex - 1].content.length - 1;
          state.currentElementId = state.pages[state.currentPage].lines[necessaryLineIndex - 1].content[lastElementIndex].id;

          const elementsToBack = state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex + 1);
          elementsToBack.forEach(element => {
            state.pages[state.currentPage].lines[necessaryLineIndex - 1].content.push(element);
          })
          state.pages[state.currentPage].lines.splice(necessaryLineIndex, 1);
        }
        // If previous element and line don't exist, and previous page exist, then then delete current line and mark last element of last line of previous page
        else if (state.currentPage - 1 >= 0 && state.pages.length > state.currentPage - 1) {
          const lastLineIndex = state.pages[state.currentPage].lines.length - 1;
          const lastElementIndex = state.pages[state.currentPage].lines[lastLineIndex].content.length - 1;
          const elementsToBack = state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex + 1);

          elementsToBack.forEach(element => {
            state.pages[state.currentPage - 1].lines[lastLineIndex].content.push(element);
          })
          state.pages[state.currentPage].lines.splice(necessaryLineIndex, 1);

          state.currentPage -= 1;
          state.currentElementId = state.pages[state.currentPage].lines[lastLineIndex].content[lastElementIndex].id;
        }
      }
      // });
    },
    addNewElement(state, action) {
      action.payload.forEach(element => {
        if (element.hasOwnProperty("symbol")) {
          const necessaryLineIndex = state.pages[state.currentPage].lines.findIndex(line => {
            if (line.id == element.lineID) {
              return true;
            }
          })

          let necessaryElementIndex;
          if (necessaryLineIndex != -1) {
            necessaryElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex].content.findIndex(element => {
              if (element.id == state.currentElementId) {
                return true;
              }
            })
          }

          let newSymbolElement = {
            id: nanoid(),
            type: "symbol",
            symbol: element.symbol,
            isBold: false,
            isItalic: false,
            isUnderlined: false,
            fontSize: 18,
            fontName: "Arial",
            color: "black",
            width: 0,
          }

          state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex + 1, 0, newSymbolElement);
          state.currentElementId = newSymbolElement.id;
          state.previouslyChangedElementsID.push(newSymbolElement.id);
        }
        else if (element.hasOwnProperty("src")) {
          const necessaryLineIndex = state.pages[state.currentPage].lines.findIndex(line => {
            if (line.id == element.lineID) {
              return true;
            }
          })

          let necessaryElementIndex;
          if (necessaryLineIndex != -1) {
            necessaryElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex].content.findIndex(element => {
              if (element.id == state.currentElementId) {
                return true;
              }
            })
          }

          const pagesFreeWidthSpace = state.pagesWidth - state.pagesHorizontalPadding * 2;
          const pagesFreeHeightSpace = state.pagesHeight - state.pagesVerticalPadding * 2;
          let ratio = 0;

          if (element.width > pagesFreeWidthSpace) {
            ratio = pagesFreeWidthSpace / element.width;
            element.width = pagesFreeWidthSpace;
            element.height *= ratio;
          }

          if (element.height > pagesFreeHeightSpace) {
            ratio = pagesFreeHeightSpace / element.height;
            element.height = pagesFreeHeightSpace;
            element.width *= ratio;
          }

          let newImageElement = {
            id: nanoid(),
            type: "image",
            imageSrc: element.src,
            width: element.width,
            height: element.height,
          }

          state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex + 1, 0, newImageElement);
          state.currentElementId = newImageElement.id;
        }
      })
    },
    DeleteChangedElementArrayByID(state, action) {
      const changedElementIndex = state.previouslyChangedElementsID.findIndex(element => {
        if (element == action.payload) return true;
      })

      state.previouslyChangedElementsID.splice(changedElementIndex, 1);
    },
    CreateNewLine(state, action) {
      const necessaryLineIndex = state.pages[state.currentPage].lines.findIndex(line => {
        if (line.id == action.payload) return true;
      })

      let necessaryElementIndex;
      if (necessaryLineIndex != -1) {
        necessaryElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex].content.findIndex(element => {
          if (element.id == state.currentElementId) return true;
        })
      }

      let emptySymbolElement = {
        id: nanoid(),
        type: "symbol",
        symbol: "",
        isBold: false,
        isItalic: false,
        isUnderlined: false,
        fontSize: 18,
        fontName: "Arial",
        color: "black",
        width: 0,
      }

      let enterFunctionElement = {
        id: nanoid(),
        type: "_enter",
        width: 0,
      }

      let newLine = {
        id: nanoid(),
        aligned: "left",
        content: [enterFunctionElement, emptySymbolElement],
      }

      state.pages[state.currentPage].lines[necessaryLineIndex].content.splice(necessaryElementIndex + 1).forEach(element => newLine.content.push(element));
      state.pages[state.currentPage].lines.splice(necessaryLineIndex + 1, 0, newLine);
      state.currentElementId = emptySymbolElement.id;
    },
    SetElementWidthByID(state, action) {
      const necessaryLineIndex = state.pages[state.currentPage].lines.findIndex(line => {
        if (line.id == action.payload.lineID) {
          return true;
        }
      })

      let necessaryElementIndex;
      if (necessaryLineIndex != -1) {
        necessaryElementIndex = state.pages[state.currentPage].lines[necessaryLineIndex].content.findIndex(element => {
          if (element.id == action.payload.elementID) {
            return true;
          }
        })
      }

      state.pages[state.currentPage].lines[necessaryLineIndex].content[necessaryElementIndex].width = action.payload.width;
    },
    OptimiseElementsPositions(state, action) {
      let overflow = false, underflow = false;

      do {
        overflow = false;
        underflow = false;
        const pagesFreeSpace = state.pagesWidth - state.pagesHorizontalPadding * 2;

        state.pages.forEach((page, pageIndex, pages) => {
          page.lines.forEach((line, lineIndex, lines) => {
            let elementsTakenWidth = 0;

            line.content.forEach(element => {
              elementsTakenWidth += element.width;
            })

            let emptySymbolElement = {
              id: nanoid(),
              type: "symbol",
              symbol: "",
              isBold: false,
              isItalic: false,
              isUnderlined: false,
              fontSize: 18,
              fontName: "Arial",
              color: "black",
              width: 0,
            }

            let newLine = {
              id: nanoid(),
              aligned: "left",
              content: [emptySymbolElement],
            }

            if (elementsTakenWidth > pagesFreeSpace) {
              const lineContentArray = line.content.map(element => {
                if (element.type == "symbol") {
                  return element.symbol;
                }
                else if (element.type == "image") {
                  return "image";
                }
                else if (element.type == "_enter") {
                  return "_enter";
                }
              })

              let lastSpaceElementIndex = lineContentArray.lastIndexOf(" ");

              if (lastSpaceElementIndex == lineContentArray.length - 1) {
                const copiedLineContentArray = lineContentArray.map(element => element);
                copiedLineContentArray.splice(copiedLineContentArray.length - 1);
                lastSpaceElementIndex = copiedLineContentArray.lastIndexOf(" ");
              }

              let lastImageElementIndex = lineContentArray.lastIndexOf("image");

              let indexForMoving = 0;

              if (lastImageElementIndex > lastSpaceElementIndex) {
                if (lastImageElementIndex == lineContentArray.length - 1) {
                  indexForMoving = lastImageElementIndex
                }
                else {
                  indexForMoving = lastImageElementIndex + 1;
                }
              }
              else {
                if (lastSpaceElementIndex != -1) {
                  indexForMoving = lastSpaceElementIndex + 1;
                }
                else {
                  indexForMoving = -1;
                }
              }

              const lineIndexOneAbove = lineIndex + 1;

              if (indexForMoving != -1) {
                pages[pageIndex].lines[lineIndex].content.splice(indexForMoving).forEach(element => newLine.content.push(element));
              }
              else {
                newLine.content.push(state.pages[pageIndex].lines[lineIndex].content.splice(pages[pageIndex].lines[lineIndex].content.length - 1)[0]);
              }

              if (pages[pageIndex].lines.length > lineIndexOneAbove &&
                pages[pageIndex].lines[lineIndexOneAbove].hasOwnProperty("content") &&
                pages[pageIndex].lines[lineIndexOneAbove].content.length > 1 &&
                pages[pageIndex].lines[lineIndexOneAbove].content[0].hasOwnProperty("type") &&
                pages[pageIndex].lines[lineIndexOneAbove].content[0].type == "_enter" ||
                pages[pageIndex].lines.length <= lineIndexOneAbove) {

                pages[pageIndex].lines.splice(lineIndexOneAbove, 0, newLine);
              }
              else {
                for (let i = 1; i < newLine.content.length; i++) {
                  const element = newLine.content[i];
                  pages[pageIndex].lines[lineIndexOneAbove].content.splice(i, 0, element);
                }
              }
            }
            else if (elementsTakenWidth < pagesFreeSpace) {
              const remainingSpace = pagesFreeSpace - elementsTakenWidth;
              let elementsWidthToGetBack = 0;

              if (page.lines.length > lineIndex + 1 &&
                page.lines[lineIndex + 1].content[0].type != "_enter") {
                const nextLineContentArray = page.lines[lineIndex + 1].content.map(element => {
                  if (element.type == "symbol") {
                    return element.symbol;
                  }
                  else if (element.type == "image") {
                    return "image";
                  }
                  else if (element.type == "_enter") {
                    return "_enter";
                  }
                })

                let firstSpaceElementIndex = nextLineContentArray.indexOf(" ");

                if (firstSpaceElementIndex == 0) {
                  const copiedLineContentArray = nextLineContentArray.map(element => element);
                  copiedLineContentArray.splice(0, 1);
                  firstSpaceElementIndex = copiedLineContentArray.indexOf(" ");
                }

                let firstImageElementIndex = nextLineContentArray.indexOf("image");

                let indexForMoving = 0;

                if (firstImageElementIndex != -1 && firstImageElementIndex < firstSpaceElementIndex || firstSpaceElementIndex == -1 && firstImageElementIndex != -1) {
                  let firstValuableIndex = -1;
                  let firstValuableIndexIsLast = false;

                  for (let d = 0; d < page.lines[lineIndex + 1].content.length; d++) {
                    const element = page.lines[lineIndex + 1].content[d];
                    if (element.type == "symbol" && element.symbol != "" || element.type == "image") {
                      firstValuableIndex = d;
                      // debugger
                      if (page.lines[lineIndex + 1].content.length == d + 1) {
                        firstValuableIndexIsLast = true;
                      }
                      break;
                    }
                  }
                  // debugger
                  if (firstImageElementIndex == firstValuableIndex && !firstValuableIndexIsLast) {
                    indexForMoving = firstImageElementIndex + 1;
                  }
                  else {
                    indexForMoving = firstImageElementIndex;
                  }
                }
                else if (firstSpaceElementIndex == -1 && firstImageElementIndex == -1) {
                  indexForMoving = nextLineContentArray.length - 1;
                }
                else {
                  indexForMoving = firstSpaceElementIndex;
                }

                if (indexForMoving != -1) {
                  for (let c = 0; c <= indexForMoving; c++) {
                    const element = page.lines[lineIndex + 1].content[c];
                    // debugger
                    elementsWidthToGetBack += element.width;
                  }
                }
                else {
                  for (let d = 0; d < page.lines[lineIndex + 1].content.length; d++) {
                    const element = page.lines[lineIndex + 1].content[d];
                    if (element.type == "symbol" && element.symbol != "" || element.type == "image") {
                      elementsWidthToGetBack += element.width;
                      break;
                    }
                  }
                }

                if (remainingSpace > elementsWidthToGetBack) {
                  for (let d = 0; d < page.lines[lineIndex + 1].content.length; d++) {
                    const element = page.lines[lineIndex + 1].content[d];
                    if (element.type == "symbol" && element.symbol != "" || element.type == "image") {
                      if (indexForMoving != -1) {
                        pages[pageIndex].lines[lineIndex + 1].content.splice(d, indexForMoving - d + 1).forEach(element => newLine.content.push(element));
                      }
                      else {
                        newLine.content.push(pages[pageIndex].lines[lineIndex + 1].content.splice(d, 1)[0]);
                      }
                      break;
                    }
                  }

                  newLine.content.forEach(element => {
                    if (element.type == "symbol" && element.symbol != "" || element.type == "image") {
                      pages[pageIndex].lines[lineIndex].content.push(element);
                    }
                  })
                  // If line is empty or don't have _enter, then delete this line
                  let emptyLine = true;
                  for (let p = 0; p < page.lines[lineIndex + 1].content.length; p++) {
                    const element = page.lines[lineIndex + 1].content[p];
                    if (element.type == "symbol" && element.symbol != "" || element.type == "_enter" || element.type == "image") {
                      emptyLine = false;
                      break
                    }
                  }

                  if (emptyLine) {
                    page.lines.splice(lineIndex + 1, 1);
                  }
                }
              }
              // else if (pages.length > pageIndex + 1 &&
              //   pages[pageIndex + 1].lines[0].content[0].type != "_enter") {
              //   const nextPageLineContentArray = pages[pageIndex + 1].lines[0].content.map(element => {
              //     if (element.type == "symbol") {
              //       return element.symbol;
              //     }
              //     else if (element.type == "image") {
              //       return "image";
              //     }
              //     else if (element.type == "_enter") {
              //       return "_enter";
              //     }
              //   })

              //   let firstSpaceElementIndex = nextPageLineContentArray.indexOf(" ");

              //   if (firstSpaceElementIndex == 0) {
              //     const copiedNextPageLineContentArray = nextPageLineContentArray.map(element => element);
              //     copiedNextPageLineContentArray.splice(0, 1);
              //     firstSpaceElementIndex = copiedNextPageLineContentArray.indexOf(" ");
              //   }

              //   if (firstSpaceElementIndex != -1) {
              //     for (let c = 0; c <= firstSpaceElementIndex; c++) {
              //       const element = pages[pageIndex + 1].lines[0].content[c];
              //       elementsWidthToGetBack += element.width;
              //     }
              //   }
              //   else {
              //     for (let d = 0; d < pages[pageIndex + 1].lines[0].content.length; d++) {
              //       const element = pages[pageIndex + 1].lines[0].content[d];
              //       if (element.type == "symbol" && element.symbol != "") {
              //         elementsWidthToGetBack += element.width;
              //         break;
              //       }
              //     }
              //   }

              //   if (remainingSpace > elementsWidthToGetBack) {
              //     for (let d = 0; d < pages[pageIndex + 1].lines[0].content.length; d++) {
              //       const element = pages[pageIndex + 1].lines[0].content[d];
              //       if (element.type == "symbol" && element.symbol != "") {
              //         if (firstSpaceElementIndex != -1) {
              //           pages[pageIndex + 1].lines[0].content.splice(d, firstSpaceElementIndex - d + 1).forEach(element => newLine.content.push(element));
              //         }
              //         else {
              //           newLine.content.push(pages[pageIndex + 1].lines[0].content.splice(d, 1)[0]);
              //         }
              //         break;
              //       }
              //     }

              //     newLine.content.forEach(element => {
              //       if (element.type == "symbol" && element.symbol != "") {
              //         pages[pageIndex].lines[lineIndex].content.push(element);
              //       }
              //     })
              //     // If line is empty or don't have _enter, then delete this line
              //     let emptyLine = true;
              //     for (let p = 0; p < pages[pageIndex + 1].lines[0].content.length; p++) {
              //       const element = pages[pageIndex + 1].lines[0].content[p];
              //       if (element.type == "symbol" && element.symbol != "" || element.type == "_enter" || element.type == "image") {
              //         emptyLine = false;
              //         break
              //       }
              //     }
              //     if (emptyLine) {
              //       pages[pageIndex + 1].lines.shift();
              //     }
              //   }
              // }
            }
          })
        })

        // Checking that all text correctly placed
        for (let i = 0; i < state.pages.length; i++) {
          const page = state.pages[i];

          for (let j = 0; j < page.lines.length; j++) {
            const line = page.lines[j];
            let elementsTakenWidth = 0;

            for (let k = 0; k < line.content.length; k++) {
              const element = line.content[k];
              elementsTakenWidth += element.width;
            }

            if (elementsTakenWidth > pagesFreeSpace) {
              overflow = true;
              break;
            }
            else if (elementsTakenWidth < pagesFreeSpace) {
              const remainingSpace = pagesFreeSpace - elementsTakenWidth;
              let elementsWidthToGetBack = 0;

              if (page.lines.length > j + 1 &&
                page.lines[j + 1].content[0].type != "_enter") {
                const nextLineContentArray = page.lines[j + 1].content.map(element => {
                  if (element.type == "symbol") {
                    return element.symbol;
                  }
                  else if (element.type == "image") {
                    return "image";
                  }
                  else if (element.type == "_enter") {
                    return "_enter";
                  }
                })

                let firstSpaceElementIndex = nextLineContentArray.indexOf(" ");

                if (firstSpaceElementIndex == 0) {
                  const copiedLineContentArray = nextLineContentArray.map(element => element);
                  copiedLineContentArray.shift();
                  firstSpaceElementIndex = copiedLineContentArray.indexOf(" ");
                }

                let firstImageElementIndex = nextLineContentArray.indexOf("image");

                let indexForMoving = 0;

                if (firstImageElementIndex != -1 && firstImageElementIndex < firstSpaceElementIndex || firstSpaceElementIndex == -1 && firstImageElementIndex != -1) {
                  indexForMoving = firstImageElementIndex;
                }
                else if (firstSpaceElementIndex == -1 && firstImageElementIndex == -1) {
                  indexForMoving = nextLineContentArray.length - 1;
                }
                else {
                  indexForMoving = firstSpaceElementIndex;
                }

                if (indexForMoving != -1) {
                  for (let c = 0; c <= indexForMoving; c++) {
                    const element = page.lines[j + 1].content[c];
                    elementsWidthToGetBack += element.width;
                  }
                }
                else {
                  for (let d = 0; d < page.lines[j + 1].content.length; d++) {
                    const element = page.lines[j + 1].content[d];
                    if (element.type == "symbol" && element.symbol != "" || element.type == "image") {
                      elementsWidthToGetBack += element.width;
                      break
                    }
                  }
                }

                if (remainingSpace > elementsWidthToGetBack) {
                  underflow = true;
                  break;
                }
              }
              // else if (state.pages.length > i + 1 &&
              //   page[i + 1].lines[0].content[0].type != "_enter") {
              //   const nextPageLineContentArray = page[i + 1].lines[0].content.map(element => {
              //     if (element.type == "symbol") {
              //       return element.symbol;
              //     }
              //     else if (element.type == "image") {
              //       return "image";
              //     }
              //     else if (element.type == "_enter") {
              //       return "_enter";
              //     }
              //   })

              //   let firstSpaceElementIndex = nextPageLineContentArray.indexOf(" ");

              //   if (firstSpaceElementIndex == 0) {
              //     const copiedNextPageLineContentArray = nextPageLineContentArray.map(element => element);
              //     copiedNextPageLineContentArray.shift();
              //     firstSpaceElementIndex = copiedNextPageLineContentArray.indexOf(" ");
              //   }

              //   if (firstSpaceElementIndex != -1) {
              //     for (let c = 0; c <= firstSpaceElementIndex; c++) {
              //       const element = page[i + 1].lines[0].content[c];
              //       elementsWidthToGetBack += element.width;
              //     }
              //   }
              //   else {
              //     for (let d = 0; d < page[i + 1].lines[0].content.length; d++) {
              //       const element = page[i + 1].lines[0].content[d];
              //       if (element.type == "symbol" && element.symbol != "") {
              //         elementsWidthToGetBack += element.width;
              //         break
              //       }
              //     }
              //   }

              //   if (remainingSpace > elementsWidthToGetBack) {
              //     underflow = true;
              //     break;
              //   }
              // }
            }
          }

          if (overflow) {
            break;
          }
          else {
            overflow = false;
          }

          if (underflow) {
            break;
          }
          else {
            underflow = false;
          }
        }
      } while (overflow || underflow)
    }
  },
})

export const { changeCurrentElementID, deleteElementsByID, addNewElement, OptimiseElementsPositions, CreateNewLine, SetElementWidthByID, DeleteChangedElementArrayByID, } = textSlice.actions;
export default textSlice.reducer;