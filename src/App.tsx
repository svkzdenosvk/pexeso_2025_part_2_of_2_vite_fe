import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";
import type { My_Type_Theme } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { defaultTheme } from "@pexeso/components/StylingComp/themes/defaultTheme";
import { mediumTheme } from "@pexeso/components/StylingComp/themes/mediumTheme";
import { hardTheme } from "@pexeso/components/StylingComp/themes/hardTheme";
import Game from "@pexeso/components/RelatedToGame/pages/Game";
import SharedMainLayout from "@pexeso/components/OutsideTheGame/layouts/SharedMainLayout";
import Home from "@pexeso/components/OutsideTheGame/pages/Home";
import GameSettings from "@pexeso/components/RelatedToGame/pages/GameSettings";
import Rules from "@pexeso/components/OutsideTheGame/pages/Rules";
import SharedAboutLayout from "@pexeso/components/OutsideTheGame/layouts/SharedAboutLayout";
import SharedLangLayout from "@pexeso/components/OutsideTheGame/layouts/SharedLangLayout";
import AboutGame from "@pexeso/components/OutsideTheGame/pages/AboutGame";
import Images from "@pexeso/components/OutsideTheGame/pages/Images";
import SingleImg from "@pexeso/components/OutsideTheGame/pages/SingleImg";
import ErrorPage from "@pexeso/components/OutsideTheGame/pages/ErrorPage";
import Registration from "@pexeso/components/LogReg/pages/Registration";
import Login from "@pexeso/components/LogReg/pages/Login";
import { useAuthState } from "@pexeso/_inc/hooks/UseAuthState";
import { useImagePreloading } from "@pexeso/_inc/hooks/UseImagePreloading";

/**
 * App Component
 *
 * Main React component of the application which provides:
 * - Global theme setup based on Redux state (default, medium, hard)
 * - Routing control using react-router-dom with i18n support
 * - User authentication management via Firebase Auth and Firestore (viac custom hook)
 * - Preloading of images required for the game and loading state management (via custom hook)
 *
 * @component
 * @remarks
 * Uses Redux to get game and user state.
 * Uses react-i18next for translations.
 * Utilizes Material-UI ThemeProvider and CssBaseline for consistent styling.
 *
 * @dependencies
 * react, react-router-dom, react-redux, firebase/auth, firebase/firestore,
 * react-i18next, @mui/material, custom Pexeso modules (themes, components, hooks, Redux slices)
 */

// ---------- Component

const App = () => {
  const { i18n } = useTranslation();
  //------------------------------------redux-----------------------------------------

  // Game state from Redux 
  const { theme: localVariableTheme } = useSelector(
    (state: RootState) => state.game
  );

  // Map theme names to imported theme objects (with typing)
  const importedThemes: Record<My_Type_Theme, typeof defaultTheme> = {
    defaultTheme,
    mediumTheme,
    hardTheme,
  };

  // Selected current theme from Redux state, fallback to default if missing
  const currentTheme =
    importedThemes[localVariableTheme as My_Type_Theme] ?? defaultTheme;

  //------------------------------------------------------------------------------------------------------------

  // Base layout styles for the main application wrapper
  const dynamicWrapperStyles = {
    height: "100%",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  /**
   * Hook: Observes user authentication state with Firebase Auth.
   * - On sign in, checks if the user exists in Firestore
   * - If not found, signs out user and clears Redux user state
   * - If found, sets user data in Redux store
   * - On sign out, clears Redux user state
   */
  useAuthState();

  /**
   * Hook: Preload game images before start.
   * - When `isLoading` is true, caches all required images.
   * - On success: dispatches `set_loading()` to update Redux.
   * - On failure: reloads page to retry.
   */

  useImagePreloading();
 
  // Select language from localStorage, i18n, or fallback config
  const storedLocalStorageLang = localStorage.getItem("lang");
  const setlang =
    storedLocalStorageLang || i18n.language || LANGUAGE_CONFIG.fallbackLang;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      {/* Wrapper container styled dynamically based on game state */}
      <Box sx={dynamicWrapperStyles}>
        <BrowserRouter>
          <Routes>
            {/* Redirect root ("/") to language-prefixed home, e.g., "/en" */}
            <Route path="/" element={<Navigate to={`/${setlang}`} replace />} />

            {/* All routes with language prefix */}
            <Route path="/:lang" element={<SharedLangLayout />}>
              {/* Main game route */}
              <Route path="game" element={<Game />} />

              {/* Shared layouts for main pages */}
              <Route element={<SharedMainLayout />}>
                <Route index element={<Home />} />
                <Route path="settings" element={<GameSettings />} />
                <Route path="login" element={<Login />} />
                <Route path="registration" element={<Registration />} />

                {/* About section subroutes */}
                <Route path="about-game" element={<SharedAboutLayout />}>
                  <Route index element={<AboutGame />} />
                  <Route path="rules" element={<Rules />} />

                  <Route path="images" element={<Images />} />
                  <Route path="images/:name" element={<SingleImg />} />
                </Route>
              </Route>

              {/* Fallback route for unknown paths */}
              <Route path="*" element={<ErrorPage />} />
            </Route>

            {/* Fallback route for unknown paths without language prefix */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
