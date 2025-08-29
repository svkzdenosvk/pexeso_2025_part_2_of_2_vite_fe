/**
 * ============================================================================
 * GAME-SPECIFIC UTILITIES
 * ============================================================================
 *
 * This module contains helper functions tightly coupled to the Pexeso game.
 * Unlike general utilities, these functions directly implement game logic
 * such as card shuffling, card creation and preloading.
 *
 * Responsibilities:
 * - Shuffle unmatched cards during gameplay
 * - Create initial card arrays (pairs with unique IDs and classes)
 * - Preload and decode images for smooth performance
 *
 * Notes:
 * - These functions should remain pure where possible, except when
 *   interacting with Redux (e.g., dispatching actions).
 * - Keep UI components thin by centralizing gameplay logic here.
 *
 * @example
 * import { createCardsArray, preloadImages } from "gameUtils"
 *
 * const cards = createCardsArray(6, ["dog", "cat", "fish"]);
 * preloadImages(["dog", "cat"]).then(() => console.log("ready"));
 * ============================================================================
 */

import { v4 as uuidv4 } from "uuid"; // random string generator
import {
  _shuffleArray
} from "@pexeso/_inc/functions/general";
import type {
  My_Type_Card_Obj,
  My_Type_Img_Name,
  My_Type_ImgCount,
  My_Type_Image
} from "../my_types";


// ============================================================================
// 2. GAME-SPECIFIC UTILITIES
// ============================================================================

/**
 * Shuffle only unmatched cards (cards with class 'mask').
 *
 * @param afterUnMatchArr - array of all cards after the last round
 * @returns a new array where only masked cards are shuffled
 */
export function _shuffleUnMatchedCards(afterUnMatchArr: My_Type_Card_Obj[]) {
  // array of 'mask' divs
  const maskCards = afterUnMatchArr.filter((div) =>
    div.classNames.includes("mask")
  );

  // shuffle mask divs
  const shuffled = _shuffleArray(maskCards);

  // new array where 'mask' divs are replaced with shuffled 'mask'
  let shuffledIndex = 0;
  afterUnMatchArr = afterUnMatchArr.map((div) => {
    if (div.classNames.includes("mask")) {
      return shuffled[shuffledIndex++];
    } else {
      return div;
    }
  });

  return afterUnMatchArr;
}

/**
 * Generate an array of card objects for the memory game.
 * Steps:
 *  - Shuffle all available images
 *  - Cut to the selected count
 *  - Duplicate to form pairs
 *  - Shuffle pairs
 *  - Assign unique IDs and CSS classes
 */
export function createCardsArray(
  selectedCountOfImg: My_Type_ImgCount,
  imgNamesInFunc: My_Type_Img_Name[]
) {
  // Shuffle to randomize order of all received picture
  const shuffledImgNamesArray = _shuffleArray(imgNamesInFunc);

  // To cut selected count of pictures
  const afterCutArrImg = shuffledImgNamesArray.slice(0, selectedCountOfImg);

  const doubleImgs = [...afterCutArrImg, ...afterCutArrImg];

  // To shuffle before every game
  const shuffledImgNamesPairsArray = _shuffleArray(doubleImgs);

  // Array of pairs names of pictures with ids
  const imgsWithKeys: My_Type_Image[] = shuffledImgNamesPairsArray.map(
    (pictureName) => ({
      id: uuidv4(),
      name: pictureName,
    })
  );

  // Array of objects: img {name,id, classes} -> div>img
  const divItems: My_Type_Card_Obj[] = imgsWithKeys.map(({ id, name }) => ({
    id: id,
    name: name,
    classNames: ["mask", "div_on_click"],
  }));

  // Return final array
  return divItems;
}

// -------------------- Image Preloading --------------------

/**
 * Preloads and decodes a set of images before gameplay.
 *
 * Ensures that all images are available in the browser cache
 * and decoded for smooth rendering when the game starts.
 *
 * @param imgNamesArr - array of image names to preload
 * @returns Promise resolved with successfully loaded image names
 */
export function preloadImages(imgNamesArr: My_Type_Img_Name[]) {
  return Promise.all(
    imgNamesArr.map((picture) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = "/pictures/pexeso/" + picture + ".jpg";

        img.onload = async () => {
          try {
            await img.decode(); // waiting for decoding :contentReference[oaicite:3]{index=3}
            resolve(picture);
          } catch {
            reject(new Error(`Chyba dekódovania: ${picture}`));
          }
        };
        img.onerror = () => reject(new Error(`Chyba načítania: ${picture}`));
      });
    })
  );
}
