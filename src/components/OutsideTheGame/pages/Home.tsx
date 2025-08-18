import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Home Page Component
 *
 * Displays the landing page of the Pexeso game.
 *
 * Responsibilities:
 * - Shows the main heading (H1) for the homepage.
 * - Uses translation keys for multilingual support.
 * - Applies custom typography and layout styles.
 *
 * @component
 * @example
 * <Home />
 *
 * @dependencies
 * - react-i18next (useTranslation for i18n)
 * - @mui/material (Box, Typography)
 */

// ---------- Sx styles

const divStyles = {
  m: "auto",
  minHeight: "70vh",
} as const;

const h1Styles = {
  fontWeight: "bold",
  fontFamily: '"Times New Roman", serif',
} as const;

// ---------- Component

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box sx={divStyles}>
      {/* Main headline of the homepage */}
      <Typography variant="h1" component="h1" sx={h1Styles}>
        {t("home_page.h1")}
      </Typography>
    </Box>
  );
};

export default Home;
