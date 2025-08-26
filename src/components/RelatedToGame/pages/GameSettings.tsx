import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { settings_and_styling_before_start } from "@pexeso/lib/redux/store/reducers/gameSlice";
import type {
  My_Type_ImgCount,
  My_Type_Level,
  My_Type_Svk_Eng_level,
} from "@pexeso/_inc/my_types";
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
} from "@pexeso/_inc/functions/general";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";
import { useResetSettings } from "../../../_inc/hooks/UseResetSettings";

/**
 * GameSettings Component
 *
 * Allows the player to choose:
 * - Difficulty level (easy, medium, hard)
 * - Number of image pairs
 *
 * Features:
 * - Validates user selections before starting the game
 * - Resets previous game state on page load
 * - Navigates to the game page after settings are saved
 *
 * @dependencies
 * - React (hooks, form handling)
 * - React Router (navigation & params)
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 */

// ---------- Sx styles

// Style for the form container
const formStyles = {
  textAlign: "center",
  mx: "auto",
  mt: 2,
};

// Style for each fieldset (group of radio buttons)
const fieldsetStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

// Style for the alert
const alertStyles = {
  borderRadius: "25px",
  padding: "15px 25px",
  fontWeight: "bold",
  justifyContent: "center",
  textAlign: "center",
  "& .MuiAlert-message": {
    width: "100%",
    textAlign: "center",
  },
};

// ---------- Component

const GameSettings = () => {
  const { t } = useTranslation();
  const { lang } = useParams(); // get language from URL

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null); // ref to form for reset

  // Local state for chosen level, image count, and errors
  const [levelChosen, setLevelChosen] = useState("" as My_Type_Level);
  const [imgCountChosen, setImgCountChosen] = useState(0 as My_Type_ImgCount);
  const [error, setError] = useState(""); // error key for i18n translation

  // Reset settings from the game by own hook
  useResetSettings();

  // Possible image count options
  const imgCountValues: My_Type_ImgCount[] = [5, 6, 7, 8];

  // Possible game levels (labels are translated)
  const levels: My_Type_Svk_Eng_level[] = [
    { value: "easy", label: t("settings_page.level.easy") },
    { value: "medium", label: t("settings_page.level.medium") },
    { value: "hard", label: t("settings_page.level.hard") },
  ];

  // Level values for validation
  const levelValues: My_Type_Level[] = ["easy", "medium", "hard"];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate – check if a level was chosen
    if (!my_Type_Guard_function(levelChosen, levelValues)) {
      setError("settings_page.error_alert.level");
      return;
    }
    // Validate – check if an image count was chosen
    if (!my_Type_Guard_function_number(imgCountChosen, imgCountValues)) {
      setError("settings_page.error_alert.img_count");
      return;
    }

    // If valid – save settings to Redux
    setError("");
    dispatch(
      settings_and_styling_before_start({
        level: levelChosen,
        selectedImgCount: imgCountChosen,
      })
    );

    // Reset form and navigate to game page
    formRef.current?.reset();
    navigate(`/${lang}/game `);
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={formStyles}>
      {/* Title */}
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        {t("settings_page.h5")}
      </Typography>

      {/* Level selection */}
      <FormControl sx={fieldsetStyles}>
        {" "}
        <FormLabel component="legend">
          {" "}
          {t("settings_page.legend.level")}
        </FormLabel>
        <RadioGroup
          row
          name="level"
          onChange={(e) => setLevelChosen(e.target.value as My_Type_Level)}
        >
          {levels.map((lvl, i) => (
            <FormControlLabel
              key={i}
              value={lvl.value}
              control={<Radio />}
              label={lvl.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Image count selection */}
      <FormControl sx={fieldsetStyles}>
        {" "}
        <FormLabel component="legend">
          {t("settings_page.legend.img_count")}
        </FormLabel>
        <RadioGroup
          row
          name="imageCount"
          onChange={(e) =>
            setImgCountChosen(parseInt(e.target.value) as My_Type_ImgCount)
          }
        >
          {imgCountValues.map((cnt, i) => (
            <FormControlLabel
              key={i}
              value={cnt.toString()}
              control={<Radio />}
              label={`${cnt * 2}`} // multiply by 2 because images come in pairs
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Show error message if present */}
      {error && (
        <Alert severity="error" sx={alertStyles}>
          {t(error)}
        </Alert>
      )}

      {/* Submit button */}
      <Button sx={pulsatingButtonStyles} type="submit">
        {t("settings_page.btn_play")}
      </Button>
    </Box>
  );
};

export default GameSettings;
