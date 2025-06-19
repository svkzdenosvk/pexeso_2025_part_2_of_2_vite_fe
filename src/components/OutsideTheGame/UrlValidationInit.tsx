// src/components/LangInit.tsx
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import i18n from "@pexeso/lib/i18n//i18n";

const SUPPORTED_LANGS = ["en", "sk", "de"];
// const SUPPORTED_URLS = ["game", "settings", "about-game"];

const UrlValidationInit = () => {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean); // napr. ["de", "images"]
    const currentPathLang = pathParts[0];

    // const isValidPage = SUPPORTED_URLS.includes(pathParts[1]);

    const isValidLang = SUPPORTED_LANGS.includes(currentPathLang);
    const currentLang = i18n.language;

    if (!isValidLang) {
      // url validation - lang exists
      navigate(`/${currentLang}/`, { replace: true });
      return;
    }

    // if (pathParts[1] && !isValidPage) {
    //   //url validation - page not exists
    //   navigate(`/${currentLang}/`, { replace: true });
    //   return
    // }

    if (currentPathLang !== currentLang) {
      // má prefix, ale nesedí s i18n.language
      const restOfPath = pathParts.slice(1).join("/");
      navigate(`/${currentLang}/${restOfPath}`, { replace: true });
      return
    }

    // 3. Ak i18n jazyk zmenil prefix, redirect na správny
    if (currentLang !== lang) {
      navigate(
        `/${i18n.language}${location.pathname.replace(`/${lang}`, "")}`,
        { replace: true }
      );
      return
    }
  }, [lang, location.pathname, navigate]);

  return null;
};

export default UrlValidationInit;
