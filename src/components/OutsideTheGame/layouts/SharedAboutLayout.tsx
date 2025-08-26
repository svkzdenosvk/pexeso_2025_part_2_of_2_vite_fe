import { Outlet, Link, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sharedNavLinkStyles } from "@pexeso/components/StylingComp/SharedStyles";

/**
 * SharedAboutLayout Component
 *
 * Provides a two-column layout for the "About Game" section, with a vertical
 * navigation sidebar and a main content area for nested routes.
 *
 * Responsibilities:
 * - Renders sidebar navigation for "Rules" and "Images" subpages
 *
 * Notes:
 * - This layout is focused on "About Game" page structure only.
 *
 * @component
 * @dependencies
 * - react-router-dom (Outlet, Link, useParams)
 * - @mui/material (Box, Button)
 * - react-i18next (useTranslation)
 *
 * @example
 * <SharedAboutLayout />
 */

// ---------- Sx styles

// Wrapper container for the entire About section layout
const sharedAboutWrapperStyles = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  "@media (max-width:600px)": {
    flexDirection: "column", // Stack vertically on small screens
  },
} as const;

// Sidebar container for navigation links
const sharedAboutAsideNavigation = {
  display: "flex",
  flexDirection: "column",
  width: "30vw",
  "@media (max-width:600px)": {
    width: "100%",
    minHeight: "auto",
  },
} as const;

// Navigation list styling
const navStyles = {
  display: "flex",
  flexDirection: "column",
  height: "200px",
  mt: "100px",
  "@media (max-width:600px)": {
    mt: "20px",
    height: "auto",
  },
} as const;

// Individual navigation button styles
const navLinkStyles = {
  margin: "10px 0px;",
} as const;

// Main content area for nested routes
const mainContentAboutStyles = {
  p: 0,
  m: 0,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  width: "70vw",
  fontSize: "20px",
  "@media (max-width:600px)": {
    width: "100%",
  },
} as const;

// ---------- Component

const SharedAboutLayout = () => {
  const { t } = useTranslation();

  // Language parameter from the current URL (used for route building)
  const { lang } = useParams();

  return (
    <Box sx={sharedAboutWrapperStyles}>
      {/* Sidebar navigation */}
      <Box sx={sharedAboutAsideNavigation}>
        <Box component="nav" sx={navStyles}>
          {/* Navigation to "Rules" subpage */}
          <Button
            component={Link}
            to={`/${lang}/about-game/rules`}
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_about_nav.rules_link")}
          </Button>

          {/* Navigation to "Images" subpage */}
          <Button
            component={Link}
            to={`/${lang}/about-game/images`}
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_about_nav.images_link")}
          </Button>
        </Box>
      </Box>

      {/* Main content area */}
      <Box sx={mainContentAboutStyles}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SharedAboutLayout;
