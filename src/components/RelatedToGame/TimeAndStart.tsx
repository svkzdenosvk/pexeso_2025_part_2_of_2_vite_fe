import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { set_start_game } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { useGameTimer } from "@pexeso/_inc/hooks/UseGameTimer";

/**
 * TimeAndStart Component
 *
 * This component handles the display of:
 * 1. Game seconds counter
 * 2. Start button for the game
 *
 * Features:
 * - Uses Redux state to track time and game status.
 * - Dynamically shows/hides start button and seconds display based on game state.
 * - Dispatches actions to start the game and increment the seconds counter.
 * - Internationalized button text via `react-i18next`.
 *
 * @dependencies
 * - React (hooks)
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 *
 * @example
 * <TimeAndStart />
 */

// ---------- Sx styles

// Static styles for the start button
const startButtonStyles = {
  color: "white",
  borderRadius: "50%",
  backgroundColor: "#99103a",
  padding: "20px",
  fontSize: "300%",
  float: "left",
  fontWeight: "bold",

  "&:hover": {
    color: "#cc0606",
  },
} as const;

// ---------- Component

export const TimeAndStart = () => {
  const { t } = useTranslation(); // i18n translation hook

  // --------------------------- Redux state
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { isRunning, isEnd } = useSelector((state: RootState) => state.game); // destructure game state
  const dispatch = useDispatch();

  // --------------------------- Dynamic styles

  const dynamicstartButtonStyles = {
    ...startButtonStyles,
    display: isRunning || isEnd ? "none" : "block", // hide button if running or ended
  };

  const dynamicSecondsStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    padding: "20px",
    fontSize: "300%",
    float: "left",
    fontWeight: "bold",
    display: isEnd ? "none" : "block", // hide seconds if game ended
  });

  // --------------------------- Seconds counter logic in own hook
  useGameTimer();

  // --------------------------- Start button click handler
  const handleStartClick = () => {
    dispatch(set_start_game()); // trigger start game
  };

  return (
    <Box id="timeAndStart" sx={{ display: "flex" }}>
      <Box id="seconds" sx={dynamicSecondsStyles}>
        {/* Seconds display */}
        {seconds} s
      </Box>

      {/* Start button */}
      <Button
        variant="contained"
        id="start"
        sx={dynamicstartButtonStyles}
        onClick={handleStartClick}
      >
        {t("game_page.btn_start")}
      </Button>
    </Box>
  );
};
