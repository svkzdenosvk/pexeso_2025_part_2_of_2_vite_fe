import { Typography, Box, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/_inc_functions";

// ---------- component

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  let setComeBacklang: string;

  //set comeback lang prefix conditions
  if (my_Type_Guard_function_isValidLang(lang)) {
    //from URL
    setComeBacklang = lang!;
    // i18n.changeLanguage(lang); // do not change lang -> page can stuck
  } else {
    //from localStorage || global || fallback
    const storedLocalStorageLang = localStorage.getItem("lang");
    setComeBacklang = storedLocalStorageLang || i18n.language || "en";
    // i18n.changeLanguage(lang); // do not change lang -> page can stuck
  }

  return (
    <Box>
      <Typography variant="h3" component="h3">
        {t("not_found_page.h3")}
      </Typography>
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
