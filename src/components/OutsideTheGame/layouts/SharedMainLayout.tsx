import { Outlet, Link, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sharedNavLinkStyles } from "@pexeso/components/StylingComp/SharedStyles";
import TranslateButtons from "../TranslateButtons";
import BackendButtons from "../BackendButtons";

/**
 * SharedLayout Component
 *
 * Provides the common navigation bar and content wrapper for subpages.
 *
 * Features:
 * - Language switcher (TranslateButtons)
 * - Main navigation links (About Game, Game Settings)
 * - Responsive navigation styles
 * - Wrapper and layout styles for consistent page structure
 *
 * @component
 * @dependencies
 * - react-router-dom (Outlet, Link, useParams)
 * - @mui/material (Box, Button)
 * - react-i18next (useTranslation)
 *
 * @example
 * <SharedLayout />
 */

// ---------- Sx styles

const sharedMainWrapperStyles = {
  p: 0,
  m: 0,
  boxSizing: "border-box",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
} as const;

const btnsGroupsStyles = {
  mb: 2,
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",

  "@media (max-width: 409px)": {
    flexDirection: "column",
    justifyContent: "space-between",
    gap:2,
  },
};

// Header container for the navigation bar
const sharedHeaderNavigation = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
} as const;

// Navigation bar styles
const navStyles = {
  display: "flex",
  width: "100%",
  backgroundColor: "#808080",
  "@media (max-width:436px)": {
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
  },
} as const;

// Individual navigation link styles
const navLinkStyles = {
  width: "50%",

  "@media (max-width: 436px)": {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
} as const;

// Main content container styles
const mainContentStyles = {
  display: "flex",
  flexDirection: "row",
  minHeight: "100%",
  width: "100%",
  // justifyContent: "center",
  "@media (max-width:600px)": {
    flexDirection: "column", // Stack vertically on small screens
  },
} as const;

// ---------- Component

const SharedMainLayout = () => {
  const { t } = useTranslation();
  // Language parameter from the current route
  const { lang } = useParams();
  return (
    // Wrapper for the entire layout
    <Box sx={sharedMainWrapperStyles}>
      <Box sx={btnsGroupsStyles}>
        {/* Language switcher */}
        <TranslateButtons />
        <BackendButtons />
      </Box>
      {/* Header navigation */}
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>
          {/* Navigation button to "About Game" section */}
          <Button
            component={Link}
            to={`/${lang}/about-game`}
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_main_nav.about_link")}
          </Button>

          {/* Navigation button to "Game Settings" section */}
          <Button
            component={Link}
            to={`/${lang}/settings`}
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_main_nav.game_link")}
          </Button>
        </Box>
      </Box>
      {/* Main content container that renders nested routes */}
      <Box sx={mainContentStyles}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SharedMainLayout;
