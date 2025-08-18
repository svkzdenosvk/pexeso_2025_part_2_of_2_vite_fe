// ============================================================================
// Utility Functions for Pexeso Project
// ============================================================================
//
// This file is divided into two main sections:
//
// 1. General Utilities (generic helpers usable across the app)
//    - _shuffleArray()
//    - _myFormatSeconds()
//    - _myToggle()
//    - Type guards (string, number, language)
//
// 2. Game-Specific Utilities (helpers tied directly to Pexeso game logic)
//    - _shuffleUnMatchedCards()
//    - createCardsArray()
//    - showImg()
//    - preloadImages()
//
// Goal:
//   - Centralize reusable logic outside of UI components
//   - Keep game logic helpers separated from generic utilities
//
// ============================================================================

import { showOne } from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { AppDispatch } from "@pexeso/lib/redux/store/store";

import { v4 as uuidv4 } from "uuid"; // random string generator

import type {
  My_Type_Card_Obj,
  My_Type_Img_Name,
  My_Type_ImgCount,
  My_Type_Image,
  My_Type_Lang,
} from "./my_types";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";

// ============================================================================
// 1. GENERAL UTILITIES
// ============================================================================

/**
 * Shuffle array using the Fisher–Yates algorithm
 *
 * @param arrayIn - input array
 * @returns a new array with elements randomly shuffled
 */
export function _shuffleArray<T>(arrayIn: T[]): T[] {
  const array = [...arrayIn];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Format seconds into string "Xm Ys"
 *
 * @example
 * _myFormatSeconds(125) → "2m 5s"
 */
export function _myFormatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minPart = minutes > 0 ? `${minutes}m ` : "";
  const secPart = `${remainingSeconds}s`;

  return minPart + secPart;
}

/**
 * Toggle between two CSS classes on a given element
 */
export function _myToggle(
  elm: HTMLElement,
  removedClass: string,
  addedClass: string
) {
  elm.classList.add(addedClass);
  elm.classList.remove(removedClass);
}

// -------------------- Type Guards --------------------

/**
 * Type guard for string union types
 */
export function my_Type_Guard_function<My_Type extends string>(
  value: string,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/**
 * Type guard for number union types
 */
export function my_Type_Guard_function_number<My_Type extends number>(
  value: number,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/**
 * Type guard for validating supported languages
 */
export const my_Type_Guard_function_isValidLang = (
  lang: unknown
): lang is My_Type_Lang => {
  return LANGUAGE_CONFIG.languages.includes(lang as My_Type_Lang);
};

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

/**
 * Reveals a hidden card if the game rules allow it.
 *
 * Steps:
 * 1. Identify currently selected cards (flipped but not yet matched).
 * 2. Identify cards currently rotating (in animation state).
 * 3. Check conditions:
 *    - Clicked card must still be masked (hidden).
 *    - There can be at most one already selected card.
 *    - No cards should currently be rotating.
 * 4. If all conditions pass, dispatch an action to reveal the clicked card.
 *
 * @param element - The clicked card's HTML container.
 * @param objectLikeCard - Card object containing ID, name, and CSS classes.
 * @param cards - Current array of all cards in the game.
 * @param dispatch - Dispatch from Redux

 */
export function showImg(
  element: HTMLDivElement,
  divObject: My_Type_Card_Obj,
  cards: My_Type_Card_Obj[],
  dispatch: AppDispatch
) {
  /* after match */
  const selectedArr = cards.filter((oneDiv) =>
    oneDiv.classNames.includes("selected_Div_img")
  );
  const rotateddArr = cards.filter((oneDiv) =>
    oneDiv.classNames.includes("rotate-center")
  );

  if (
    /*-------------if divImg is not selected + prevent 3 imgs show*/
    element.classList.contains("mask") &&
    (selectedArr.length === 0 || selectedArr.length === 1) &&
    rotateddArr.length === 0
  ) {
    dispatch(showOne(divObject));
  }
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
