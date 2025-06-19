import { Outlet, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import UrlValidationInit from "../UrlValidationInit";

const SharedLangLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const supportedLangs = ["en", "sk", "de"];
  const isValidLang = supportedLangs.includes(lang || "");

  if (!isValidLang) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

//   const pathParts = location.pathname.split("/").filter(Boolean); // napr. ["de", "images"]
//   const currentPathLang = pathParts[0];

//   const currentLang = i18n.language;

//   if (currentPathLang !== currentLang) {
//     // má prefix, ale nesedí s i18n.language
//     const restOfPath = pathParts.slice(1).join("/");
//     <Navigate to={`/${currentLang}/${restOfPath}`} replace />
//     return;
//   }
  // Nastav jazyk
//   if (i18n.language !== lang) {
//     i18n.changeLanguage(lang);
//   }

  return (
    <>
      {/* <UrlValidationInit /> */}

      <Outlet />
    </>
  );
};

export default SharedLangLayout;
