import { Typography, Box, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/functions/general";

/**
 * ErrorPage
 *
 * Displays a fallback "Not Found" page when an invalid route is accessed.
 *
 * @component
 * @example
 * <ErrorPage />
 *
 * @remarks
 * - Uses `useTranslation` for i18n text.
 * - Reads `lang` from URL params; validates against supported languages.
 * - Determines comeback language from:
 *    1. Valid URL param
 *    2. LocalStorage "lang"
 *    3. Active i18n language
 *    4. Fallback → "en"
 * - Provides a "Back to Home" button with pulsating style.
 * - Language is **not changed** on this page to avoid app freeze loops.
 *
 * @dependencies
 * - react-i18next (useTranslation)
 * - react-router-dom (useParams, Link)
 * - @mui/material (Typography, Box, Button)
 * - @pexeso/components/StylingComp/SharedStyles (pulsatingButtonStyles)
 * - @pexeso/_inc/_inc_functions (my_Type_Guard_function_isValidLang)
 */

// ---------- component

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  let setComeBacklang: string;

  // Setup comeback language based on URL or fallback options
  if (my_Type_Guard_function_isValidLang(lang)) {
    // Use valid URL param
    setComeBacklang = lang!;
    // Note: do not call i18n.changeLanguage here → can cause app freeze
  } else {
    // Use localStorage, current i18n or fallback "en"
    const storedLocalStorageLang = localStorage.getItem("lang");
    setComeBacklang = storedLocalStorageLang || i18n.language || "en";
    // Note: do not call i18n.changeLanguage here → can cause app freeze
  }

  return (
    <Box>

      {/* Heading message for "Not Found" */}
      <Typography variant="h3" component="h3">
        {t("not_found_page.h3")}
      </Typography>

      {/* Button → navigates back to homepage in the resolved comeback language */}
      <Button
        component={Link}
        to={`/${setComeBacklang}/`}
        variant="contained"
        sx={pulsatingButtonStyles}
      >
        {t("not_found_page.btn_back")}
      </Button>
    </Box>
  );
};

export default ErrorPage;
