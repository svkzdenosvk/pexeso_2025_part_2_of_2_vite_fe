import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/_inc_functions";

/**
 * LanguageInit Component
 *
 * Initializes and manages the application's language settings based on:
 * - URL language prefix
 * - Local storage preference
 * - Fallback language (if no valid setting is found)
 *
 * Features:
 * - Validates language parameter in the URL.
 * - Syncs language between URL, localStorage, and i18n instance.
 * - Automatically redirects to correct URL when needed.
 *
 * @component
 * @dependencies
 * - react-router-dom (useParams, useNavigate, useLocation)
 * - react-i18next (useTranslation)
 * - Internal config: LANGUAGE_CONFIG (supported langs & fallback)
 * - Internal util: my_Type_Guard_function_isValidLang (validation)
 *
 * @example
 * <LanguageInit />
 */

// ---------- Component

const LanguageInit = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (my_Type_Guard_function_isValidLang(lang)) {
      // Take language from URL and save it to localStorage
      i18n.changeLanguage(lang!);
      localStorage.setItem("lang", lang!);
    } else {
      // If language is not in url -> look at localStorage
      const storedLang = localStorage.getItem("lang");

      if (my_Type_Guard_function_isValidLang(storedLang)) {
        // Use stored language and update URL
        i18n.changeLanguage(storedLang);
        navigate(`/${storedLang}${location.pathname}`, { replace: true });
      } else {
        // Fallback to default language
        i18n.changeLanguage(LANGUAGE_CONFIG.fallbackLang);
        navigate(`/${LANGUAGE_CONFIG.fallbackLang}${location.pathname}`, {
          replace: true,
        });
      }
    }
  }, [lang, i18n, location.pathname, navigate]);

  return null;
};

export default LanguageInit;
