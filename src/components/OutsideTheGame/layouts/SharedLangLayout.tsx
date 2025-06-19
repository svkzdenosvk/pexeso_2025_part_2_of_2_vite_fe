import { useEffect } from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import UrlValidationInit from "../UrlValidationInit";

const SharedLangLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const supportedLangs = ["en", "sk", "de"];
  const isValidLang = supportedLangs.includes(lang || "");

   useEffect(() => {
    if (lang && i18n.language !== lang && isValidLang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, isValidLang]);

  if (!isValidLang) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

//   const pathParts = location.pathname.split("/").filter(Boolean); // napr. ["de", "images"]
//   const currentPathLang = pathParts[0];

//   const currentLang = i18n.language;

//   if (currentPathLang !== currentLang) {
//     // má prefix, ale nesedí s i18n.language
//     const restOfPath = pathParts.slice(1).join("/");
//     <Navigate to={`/${currentLang}/${restOfPath}`}  />
//     return;
//   }


  return (
    <>
      {/* <UrlValidationInit /> */}

      <Outlet />
    </>
  );
};

export default SharedLangLayout;
