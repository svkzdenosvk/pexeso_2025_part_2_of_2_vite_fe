// LanguageWrapper.tsx
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import SharedLayout from "./layouts/SharedMainLayout";
// import UrlValidationInit from "../UrlValidationInit";

const LanguageWrapper = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const supportedLangs = ["en", "sk", "de"];
  const isValidLang = supportedLangs.includes(lang || "");

  if (!isValidLang) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  // Nastav jazyk
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <>
      {/* <UrlValidationInit /> */}

      <Outlet />
    </>
  );
};

export default LanguageWrapper;
