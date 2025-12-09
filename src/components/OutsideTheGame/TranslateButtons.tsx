import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";

/**
 * TranslateButtons Component
 *
 * Provides a set of buttons to switch the application language.
 * Handles changing the language in i18next, saving the choice
 * in localStorage, and updating the current URL to include
 * the selected language prefix.
 *
 * Features:
 * - Displays language buttons dynamically based on configuration.
 * - Highlights the currently selected language.
 * - Saves selection to localStorage.
 * - Updates the URL to reflect the chosen language.
 *
 * @component
 * @dependencies
 * - MUI (Button, ButtonGroup, Box)
 * - react-i18next (translations)
 * - react-router-dom (navigation)
 * - Internal language configuration (LANGUAGE_CONFIG)
 *
 * @example
 * <TranslateButtons />
 */

// ---------- Component

const TranslateButtons = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = i18n.language;

  /**
   * Handles language change:
   * 1. Changes language in i18next.
   * 2. Updates localStorage.
   * 3. Rewrites URL prefix to match new language.
   */
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);

    // Get current path parts, e.g. ["de", "images"]
    const pathParts = location.pathname.split("/").filter(Boolean);
    const restOfPath = pathParts.slice(1).join("/");

    // Save language in localStorage
    localStorage.setItem("lang", lng!);

    // Navigate to same page with new language prefix
    navigate(`/${lng}/${restOfPath}`);
  };

  return (
    <Box
      sx={{
        // mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",

        "@media (max-width: 550px)": {
          flexDirection: "column",
        },
      }}
    >
      <Typography variant="h6">Lang:</Typography>
      {/* Language selection buttons */}
      <ButtonGroup
        variant="outlined"
        color="primary"
        sx={{
          boxShadow: 3, // medium shadow elevation
          borderRadius: "12px",
          overflow: "hidden", // ensures child buttons respect border radius
        }}
      >
        {LANGUAGE_CONFIG.languages.map((lng) => (
          <Button
            key={lng}
            onClick={() => changeLanguage(lng)}
            // Highlight current language with filled variant
            variant={currentLang === lng ? "contained" : "outlined"}
            sx={{
              textTransform: "uppercase", // EN/SK/DE instead of En/Sk/De
              fontWeight: "bold",
              px: 2,
              py: 1,
              fontSize: "0.85rem", // slightly smaller text
              minWidth: 50,
            }}
          >
            {lng}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default TranslateButtons;
