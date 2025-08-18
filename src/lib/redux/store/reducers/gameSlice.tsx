import type {
  My_Type_Img_Name,
  My_Type_Level,
  My_Type_Card_Obj,
  My_Type_ClassNames,
  My_Type_ImgCount,
  My_Type_Theme,
} from "@pexeso/_inc/my_types";
import {
  _shuffleArray,
  _shuffleUnMatchedCards,
} from "@pexeso/_inc/_inc_functions";

import { createSlice } from "@reduxjs/toolkit";

/**
 * Game Slice
 *
 * Redux Toolkit slice responsible for managing the main game state, including:
 * - Images, levels, theme, and gameplay flags.
 * - Card matching logic, shuffling, and removal animations.
 * - Game lifecycle: start, in-progress, end.
 *
 * Features:
 * 1. **State Structure**
 *    - `imgNames` → Available image identifiers for the game.
 *    - `isLoading` → Indicates if game assets are still loading.
 *    - `isRunning` → Whether the game is currently active.
 *    - `linkName` → Key for displaying the current status in the UI.
 *    - `level` → Selected difficulty level.
 *    - `isEnd` → True if the game has ended.
 *    - `cards` → Array of card objects with IDs and classNames.
 *    - `selectedImgCount` → Number of cards selected for this session.
 *    - `theme` → Current theme styling based on difficulty.
 *
 * 2. **Reducers (Actions)**
 *    - `set_start_game` → Marks game as running and updates status link.
 *    - `hardest_level_shuffle` → Randomizes card positions for "hardest" mode.
 *    - `showOne` → Reveals a single clicked card.
 *    - `un_match` → Handles non-matching pair logic (with optional shuffle).
 *    - `match` → Handles matching pair animation.
 *    - `remove_after_match` → Disables matched cards after animation.
 *    - `end_game` → Ends the game and updates status link.
 *    - `after_settings_selected_img_count` → Sets cards after settings confirmation.
 *    - `reset_settings` → Resets settings when returning to the menu.
 *    - `settings_and_styling_before_start` → Applies theme and difficulty before start.
 *    - `set_loading` → Marks assets as loaded.
 *
 * @dependencies
 * redux-toolkit (createSlice), custom shuffle functions
 */

//----------------------------------------------------------------------------redux toolkit

const gameSlice = createSlice({
  name: "game",
  initialState: {
    imgNames: [
      "drop",
      "wood",
      "lightning",
      "wind",
      "vibration",
      "sun",
      "space",
      "sea",
    ] as My_Type_Img_Name[],
    isLoading: true,
    isRunning: false,
    linkName: "game_page.link_before_start",
    level: "" as My_Type_Level,
    isEnd: false,
    cards: [] as My_Type_Card_Obj[],
    selectedImgCount: 0 as My_Type_ImgCount,
    theme: "defaultTheme" as My_Type_Theme,
  },
  reducers: {
    /** Starts the game and updates the UI link text */
    set_start_game: (state) => {
      state.isRunning = true;
      state.linkName = "game_page.link_after_start";
    },

    /** Shuffles all cards — used for hardest difficulty mode */
    hardest_level_shuffle: (state) => {
      const afterUnMatchArr = _shuffleArray(state.cards);

      state.cards = afterUnMatchArr;
    },

    /** Reveals a single card after clicking on it */
    showOne: (state, action) => {
      state.cards.forEach((oneCard) => {
        if (oneCard.id === action.payload.id) {
          oneCard.classNames = [
            ...oneCard.classNames.filter((className) => className !== "mask"),
            "selected_Div_img",
          ];
        }
      });
    },

    /** Handles two revealed cards that do not match */
    un_match: (state, action) => {
      const afterUnMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        // change 2 selected img´s to nonselected and hide
        if (oneCard.classNames.includes("selected_Div_img")) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== "selected_Div_img"
              ),
              "mask", // remove "selected" and add "mask" class
            ],
          };
        } else {
          // if img wasn´t selected -> nothing to change
          return oneCard;
        }
      });

      let shuffledUnMatchedCards = afterUnMatchArr;

      // Shuffle only masked cards in medium mode
      if (action.payload === "medium") {
        shuffledUnMatchedCards = _shuffleUnMatchedCards(afterUnMatchArr);
      }

      state.cards = shuffledUnMatchedCards;
    },

    /** Handles two revealed cards that match */
    match: (state) => {
      const afterMatchArr: My_Type_Card_Obj[] = state.cards.map((oneCard) => {
        // remove selected and add rotate class -> change 2 selected img´s to nonselected and animate
        if (oneCard.classNames.includes("selected_Div_img")) {
          return {
            ...oneCard,
            classNames: [
              ...oneCard.classNames.filter(
                (className) => className !== "selected_Div_img"
              ),
              "rotate-center",
            ] as My_Type_ClassNames[],
          };
        } else {
          // if img wasn´t selected -> nothing to change
          return oneCard;
        }
      });

      state.cards = afterMatchArr;
    },
    /** Removes matched cards by disabling them after animation */
    remove_after_match: (state) => {
      const afterAnimationMatchArr: My_Type_Card_Obj[] = state.cards.map(
        (oneCard) => {
          // remove rotate and add disabled class -> change 2 animated img´s to nonanimated and hide
          if (oneCard.classNames.includes("rotate-center")) {
            return {
              ...oneCard,
              classNames: [
                ...oneCard.classNames.filter(
                  (className) => className !== "rotate-center"
                ),
                "disabled",
              ] as My_Type_ClassNames[],
            };
          } else {
            //if img wasn´t selected -> nothing to change
            return oneCard;
          }
        }
      );
      // if all pictures removed -> it´s end of the game
      state.cards = afterAnimationMatchArr;
    },

    /** Ends the game and updates state flags */
    // The game is over after all imgs has been removed
    end_game: (state) => {
      state.isRunning = false;
      state.linkName = "game_page.link_end_game";
      state.isEnd = true;
    },

    /** Sets cards after settings have been confirmed */
    create_cards_arr: (state, action) => {
      state.cards = action.payload;
      // state.isLoading=false; //---------------------------------------------maybe for the future to test this  !!!!!!
    },

    /** Resets game settings when returning to the settings menu */
    reset_settings: (state) => {
      state.level = "" as My_Type_Level;
      state.selectedImgCount = 0 as My_Type_ImgCount;
      state.isRunning = false;
      state.isEnd = false;
      state.theme = "defaultTheme";
    },
    /** Applies selected settings and theme before game starts */
    // After set the settings (but before clicking to start button)
    settings_and_styling_before_start: (state, action) => {

      /*using dynamic object properties*/
      const levelChanges: Record<My_Type_Level, My_Type_Theme> = {
        easy: "defaultTheme",
        medium: "mediumTheme",
        hard: "hardTheme",
      };

      state.level = action.payload.level;
      state.selectedImgCount = action.payload
        .selectedImgCount as My_Type_ImgCount;
      state.theme = levelChanges[
        action.payload.level as My_Type_Level
      ] as My_Type_Theme;
    },
   
    // After loading imgs (in app.tsx)
    set_loading: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  set_start_game,
  set_loading,
  settings_and_styling_before_start,
  create_cards_arr,
  remove_after_match,
  match,
  un_match,
  reset_settings,
  showOne,
  hardest_level_shuffle,
  end_game,
} = gameSlice.actions;
export default gameSlice.reducer;
