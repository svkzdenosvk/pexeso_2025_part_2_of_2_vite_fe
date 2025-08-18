import { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Box, Button } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
  _myFormatSeconds, createCardsArray
} from "@pexeso/_inc/_inc_functions";
import { create_cards_arr } from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { RootState } from "@pexeso/lib/redux/store/store";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";
import { PlayBoard } from "../PlayBoard";
import { TimeAndStart } from "../TimeAndStart";

/**
 * Game Component
 *
 * Main game screen component.
 * Handles game initialization, validation of settings, and rendering of
 * the game interface (including the play board, timer, and control buttons).
 *
 * Features:
 * - Validates selected game settings (level, image count) before starting.
 * - Generates game card data from image names and count.
 * - Displays congratulatory message when the game ends.
 * - Shows start button, timer, and play board dynamically based on game state.
 *
 * @component
 * @dependencies
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 * - Internal utilities (type guards, data generation functions)
 *
 * @route /game
 *
 * @example
 * <Game />
 */

// ---------- Sx styles

// Button style for navigation back to settings
const gameLinkButtonStyles = {
  backgroundColor: "grey",
  maxWidth: "300px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  padding: "15px 32px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "4px auto",
  cursor: "pointer",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s, transform 0.2s",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    color: "goldenrod",
    backgroundColor: "#696969",
  },
} as const;

// Main welcome/start container styles
const welcomeStyles = {
  width: "100%",
  height: "100%",
  m: 0,
  p: 0,
  boxSizing: "border-box",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "@media (min-width:1650px)": {
    width: "1650px",
  },
} as const;

// Styles for the column containing play board content
const columnContentStyles = {
  maxWidth: "850px",
  flexDirection: "column",
  justifyContent: "space-evenly",
} as const;

// ---------- Component

export const Game = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get game state from Redux
  const seconds = useSelector((state: RootState) => state.time.seconds);

  const { imgNames, level, selectedImgCount, linkName, isRunning, isEnd } =
    useSelector((state: RootState) => state.game);

  // --------------------------- Dynamic styles
  const afterStartStyles = isRunning && !isEnd;

  // Play board is only visible after game starts
  const dynamicColumnContentStyles = {
    ...columnContentStyles,
    display: afterStartStyles ? "flex" : "none",
  };

  const colorTextThemeStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    display: isRunning || isEnd ? "none" : "block",
  });
  /*-------------------------------------------------------------------------------------------- */

  /**
   * On component mount:
   * 1. Validate game settings (level + image count)
   * 2. If invalid → redirect to /${lang}/settings
   * 3. If valid → create shuffled card array & store in Redux
   */
  useEffect(() => {
    if (
      !my_Type_Guard_function(level, ["easy", "medium", "hard"]) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      navigate(`/${lang}/settings `);

      return;
    } else {
      // Create array of cards [objects (div > img)] to play from img names and img count
      const cards: My_Type_Card_Obj[] = createCardsArray(
        selectedImgCount,
        imgNames
      );

      // Store cards in redux
      dispatch(create_cards_arr(cards));
    }
  }, [level, selectedImgCount, navigate, dispatch, imgNames, lang]);

  return (
    <>
      {/* Main game container */}
      <Box className="welcome" sx={welcomeStyles}>
        {/* Congratulation message when game ends */}
        {isEnd && (
          <Typography variant="h1" sx={{ marginBottom: "70px" }}>
            {t("game_page.congratulations")} {_myFormatSeconds(seconds)}
          </Typography>
        )}
        {/* Button to go back to /${lang}/settings */}
        <Button
          component={Link}
          to={`/${lang}/settings`}
          variant="contained"
          sx={gameLinkButtonStyles}
        >
          {t(linkName)}
        </Button>

        {/* Game instructions (hidden during gameplay) */}
        <Typography variant="h5" component="h5" sx={colorTextThemeStyles}>
          {t("game_page.h5")}
        </Typography>

        {/* Timer and Start button component */}
        <TimeAndStart />
      </Box>

      {/* Game board: appears only when game is running */}
      <Box
        className="column_content"
        id="content"
        sx={dynamicColumnContentStyles}
      >
        <PlayBoard />
      </Box>
    </>
  );
};

export default Game;
