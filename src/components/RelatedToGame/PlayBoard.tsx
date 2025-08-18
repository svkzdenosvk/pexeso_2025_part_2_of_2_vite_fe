import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";

// Redux actions – handle matches, mismatches, and hardest-level shuffling
import {
  match,
  un_match,
  hardest_level_shuffle,
} from "@pexeso/lib/redux/store/reducers/gameSlice";

// Helper function – reveal image on card click
import { showImg } from "@pexeso/_inc/_inc_functions";

// Card component – renders individual cards
import Card from "./Card";

/**
 * PlayBoard Component
 *
 * This component renders the game board containing all playable cards
 * and manages the main gameplay logic:
 * 1. Detects when two cards are selected and checks if they match.
 * 2. Dispatches Redux actions for matching or unmatching pairs.
 * 3. Handles "hard" difficulty with automatic shuffling.
 *
 * Features:
 * - Uses Redux state to manage card data, game level, and loading status.
 * - Restores pointer functionality after card comparison to avoid accidental clicks.
 * - Internationalized loading message via `react-i18next`.
 *
 * @dependencies
 * - React (hooks)
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 * - Local helper functions (`showImg`)
 * - Local component (`Card`)
 *
 * @example
 * <PlayBoard />
 */

// ---------- Sx styles

// Layout for the row of cards
const rowStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  flex: "1 1 50%",
  mt: "1.5%",
} as const;

// Dynamic text color based on current theme
const colorTextThemeStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

// ---------- Component

export const PlayBoard = () => {
  const { t } = useTranslation();

  // Redux – get game state values
  const { cards, level, isLoading } = useSelector(
    (state: RootState) => state.game
  ); //-------------with destructuring

  const dispatch = useDispatch();

  /*  useEffect – triggered when cards or level change
   *
   *  Handles:
   *    1. Checking if two cards are selected and comparing them
   *    2. Triggering shuffle for hardest difficulty
   */
  useEffect(() => {
    // Delay for checking selected cards (allows flip animation to complete)
    setTimeout(function () {
      // Get currently selected cards
      const selectedArr: My_Type_Card_Obj[] = cards.filter((oneCard) =>
        oneCard.classNames.includes("selected_Div_img")
      );

      // If two cards are selected
      if (selectedArr.length === 2) {
        // If they match
        if (selectedArr[0].name === selectedArr[1].name) {
          dispatch(match());
        } else {
          // If they don't match
          dispatch(un_match(level));
        }
      }

      // Give back click functionality to pointer
      document.body.style.pointerEvents = "auto";
    }, 200);

    // If hardest level – shuffle cards periodically
    if (level === "hard") {
      const intervalShuffleHardest = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);

      // Clear interval when effect cleans up
      return () => clearInterval(intervalShuffleHardest);
    }
  }, [dispatch, cards, level]);

  return (
    <Box className="row" id="row" sx={rowStyles}>
      {/* Show loading message while images are being prepared */}
      {isLoading ? (
        <Typography variant="h2" component="h2" sx={colorTextThemeStyles}>
          {t("images_page.loading")}
        </Typography>
      ) : (
        // Render all game cards
        cards.map(
          (
            oneCard: My_Type_Card_Obj //-------------------------------------------array of img names -> div>img
          ) => (
            <Card
              key={oneCard.id}
              card={oneCard}
              onClick={(e) =>
                showImg(e.currentTarget, oneCard, cards, dispatch)
              }
            />
          )
        )
      )}
    </Box>
  );
};

