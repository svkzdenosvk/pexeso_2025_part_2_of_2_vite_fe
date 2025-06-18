import { Outlet, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sharedNavLinkStyles } from "@pexeso/components/StylingComp/SharedStyles";

// ---------- sx styles

const sharedAboutWrapperStyles = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  minHeight: "70vh",
  "@media (max-width:600px)": {
    flexDirection: "column",
  },
} as const;

const sharedAboutAsideNavigation = {
  display: "flex",
  flexDirection: "column",
  width: "30vw",
  minHeight: "70vh",
  "@media (max-width:600px)": {
    width: "100%",
    minHeight: "auto",
  },
} as const;

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

const navLinkStyles = {
  margin: "10px 0px;",
} as const;

const mainContentAboutStyles = {
  p: 0,
  m: 0,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  minHeight: "70vh",
  width: "70vw",
  fontSize: "20px",
  "@media (max-width:600px)": {
    width: "100%",
  },
} as const;

// ---------- component

const SharedAboutLayout = () => {
  const { t } = useTranslation();

  return (
    <Box sx={sharedAboutWrapperStyles}>
      <Box sx={sharedAboutAsideNavigation}>
        <Box component="nav" sx={navStyles}>
          <Button
            component={Link}
            to="/about-game/rules"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_about_nav.rules_link")}
          </Button>
          <Button
            component={Link}
            to="/about-game/images"
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_about_nav.images_link")}
          </Button>
        </Box>
      </Box>

      <Box sx={mainContentAboutStyles}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SharedAboutLayout;
