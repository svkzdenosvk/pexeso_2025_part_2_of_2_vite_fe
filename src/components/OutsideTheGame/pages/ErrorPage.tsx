import { Typography, Box, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";
// import LanguageInit from "../UrlValidationInit";

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  // const supportedLangs = ["en", "sk", "de"];
  // const isValidLang = supportedLangs.includes(lang || "");

  // if (isValidLang) {
  //   i18n.changeLanguage(lang);
  // }

  console.log("toto je z url", lang);
  console.log("toto je nastavený", i18n.language);

  return (
    <Box>

      <Typography variant="h3" component="h3">
        {" "}
        {/*originally h1 */}
        {t("not_found_page.h3")}
      </Typography>
      <Button
        component={Link}
        to={`/${lang}/`}
        variant="contained"
        sx={pulsatingButtonStyles}
      >
        {t("not_found_page.btn_back")}
      </Button>
    </Box>
  );
};

export default ErrorPage;
