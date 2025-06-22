import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/_inc_functions";

// ---------- component

const LanguageInit = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (my_Type_Guard_function_isValidLang(lang)) {
      //take lang from URL and save it to localStorage
      i18n.changeLanguage(lang!);
      localStorage.setItem("lang", lang!);
    } else {
      // if lang is not in url -> look at localStorage
      const storedLang = localStorage.getItem("lang");

      // if (storedLang && supportedLangs.includes(storedLang)) {
      if (my_Type_Guard_function_isValidLang(storedLang)) {
        i18n.changeLanguage(storedLang);
        navigate(`/${storedLang}${location.pathname}`, { replace: true });
      } else {
        // fallback "EN"
        i18n.changeLanguage(LANGUAGE_CONFIG.fallbackLang);
        console.log("som vo fallbacku");
        navigate(`/${LANGUAGE_CONFIG.fallbackLang}${location.pathname}`, { replace: true });
      }
    }
  }, [lang, i18n, location.pathname, navigate]);

  return null;
};

export default LanguageInit;
