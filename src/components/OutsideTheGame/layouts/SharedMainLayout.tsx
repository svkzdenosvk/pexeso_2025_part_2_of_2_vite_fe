import { Outlet, Link, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { sharedNavLinkStyles } from "@pexeso/components/StylingComp/SharedStyles";
import TranslateButtons from "../TranslateButtons";
// import ButtonLogReg from "@pexeso/components/LogReg/ButtonLogReg";

// ---------- sx styles

const sharedWrapperStyles = {
  p: 0,
  m: 0,
  boxSizing: "border-box",
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
} as const;

const sharedHeaderNavigation = {
  height: "30vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
} as const;

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

const navLinkStyles = {
  width: "50%",

  "@media (max-width: 436px)": {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
} as const;

const mainContentStyles = {
  display: "flex",
  flexDirection: "row",
  minHeight: "100%",
  width: "100%",
  // justifyContent: "center",
  "@media (max-width:600px)": {
    flexDirection: "column",
  },
} as const;

// ---------- component

const SharedLayout = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  return (
    <Box sx={sharedWrapperStyles}>
      {/* <ButtonLogReg /> */}

      <TranslateButtons />
      <Box sx={sharedHeaderNavigation}>
        <Box sx={navStyles}>
          <Button
            component={Link}
            to={`/${lang}/about-game`}
            variant="contained"
            sx={[sharedNavLinkStyles, navLinkStyles]}
          >
            {t("shared_main_nav.about_link")}
          </Button>

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
      <Box sx={mainContentStyles}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default SharedLayout;
