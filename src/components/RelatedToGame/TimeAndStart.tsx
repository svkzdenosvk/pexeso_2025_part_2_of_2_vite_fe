import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Button, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { seconds_counter } from "@pexeso/lib/redux/store/reducers/secondsSlice";
import { set_start_game } from "@pexeso/lib/redux/store/reducers/gameSlice";

// ---------- sx styles

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

// ---------- component

export const TimeAndStart = () => {
  const { t } = useTranslation();

  // ---------------------------redux
  const seconds = useSelector((state: RootState) => state.time.seconds);
  const { isRunning, isLoading, isEnd } = useSelector(
    (state: RootState) => state.game
  ); //-------------with destructuring
  const dispatch = useDispatch();
  //------------------------------------------------------------------------------------------------
  //dynamic styles

  const dynamicstartButtonStyles = {
    ...startButtonStyles,
    display: isRunning || isEnd ? "none" : "block",
  };

  const dynamicSecondsStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    padding: "20px",
    fontSize: "300%",
    float: "left",
    fontWeight: "bold",
    display: isEnd ? "none" : "block",
  });

  /*-------------------------------------------------------------------------------------------- */

  //seconds counter
  useEffect(() => {
    if (!isRunning || isLoading || isEnd) return;

    const interval = setInterval(() => {
      dispatch(seconds_counter());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch, isLoading, isEnd]);

  //trigger function to start count of seconds
  const handleStartClick = () => {
    dispatch(set_start_game());
  };

  return (
    <Box id="timeAndStart" sx={{ display: "flex" }}>
      <Box id="seconds" sx={dynamicSecondsStyles}>
        {seconds} s
      </Box>

      <Button
        variant="contained"
        id="start"
        sx={dynamicstartButtonStyles}
        onClick={handleStartClick}
      >
        {/* START */}
        {t("game_page.btn_start")}
      </Button>
    </Box>
  );
};
