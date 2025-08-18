import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Box } from "@mui/material";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";
import { preloadImages } from "@pexeso/_inc/_inc_functions";
import type { My_Type_Theme } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { set_loading } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import { defaultTheme } from "@pexeso/components/StylingComp/themes/defaultTheme";
import { mediumTheme } from "@pexeso/components/StylingComp/themes/mediumTheme";
import { hardTheme } from "@pexeso/components/StylingComp/themes/hardTheme";
import Game from "@pexeso/components/RelatedToGame/pages/Game";
import SharedLayout from "@pexeso/components/OutsideTheGame/layouts/SharedMainLayout";
import Home from "@pexeso/components/OutsideTheGame/pages/Home";
import GameSettings from "@pexeso/components/RelatedToGame/pages/GameSettings";
import Rules from "@pexeso/components/OutsideTheGame/pages/Rules";
import SharedAboutLayout from "@pexeso/components/OutsideTheGame/layouts/SharedAboutLayout";
import SharedLangLayout from "@pexeso/components/OutsideTheGame/layouts/SharedLangLayout";
import AboutGame from "@pexeso/components/OutsideTheGame/pages/AboutGame";
import Images from "@pexeso/components/OutsideTheGame/pages/Images";
import SingleImg from "@pexeso/components/OutsideTheGame/pages/SingleImg";
import ErrorPage from "@pexeso/components/OutsideTheGame/pages/ErrorPage";
import Registration from "@pexeso/components/LogReg/Registration";
import Login from "@pexeso/components/LogReg/Login";

/**
 * App Component
 *
 * Main React component of the application which provides:
 * - Global theme setup based on Redux state (default, medium, hard)
 * - Routing control using react-router-dom with i18n support
 * - User authentication management via Firebase Auth and Firestore
 * - Preloading of images required for the game and loading state management
 * - Dynamic container styles based on game state (end of game vs active)
 *
 * @component
 * @remarks
 * Uses Redux to get game and user state.
 * Uses react-i18next for translations.
 * Utilizes Material-UI ThemeProvider and CssBaseline for consistent styling.
 *
 * @dependencies
 * react, react-router-dom, react-redux, firebase/auth, firebase/firestore,
 * react-i18next, @mui/material, custom Pexeso modules (themes, components, Redux slices)
 */

// ---------- Component

const App = () => {
  const { i18n } = useTranslation();
  //------------------------------------redux-----------------------------------------
  const dispatch = useDispatch();

  // Game state from Redux – controls theme, loading status, and game end flag
  const {
    imgNames,
    isLoading,
    theme: localVariableTheme,
    isEnd,
  } = useSelector((state: RootState) => state.game);

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

  // Dynamic styles for the main wrapper depending on whether the game ended or is active
  const dynamicWrapperStyles = {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: isEnd ? "center" : "flex-start",
  };

  /**
   * Effect: Observes user authentication state with Firebase Auth.
   * - On sign in, checks if the user exists in Firestore
   * - If not found, signs out user and clears Redux user state
   * - If found, sets user data in Redux store
   * - On sign out, clears Redux user state
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const docRef = doc(projectUsers, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            //Sign out user without profile in Firestore
            await auth.signOut();
            dispatch(clearUser());
            return;
          }

          const data = docSnap.data();
          dispatch(
            setUser({
              uid: user.uid,
              name: data?.name ?? "",
              email: user.email,
            })
          );
        } catch (err) {
          // Error during checking of profile in Firestore
          console.error("Error during checking of profile in Firestore:", err);
          dispatch(clearUser());
        }
      } else {
        // User signed out - clear Redux user state
        dispatch(clearUser());
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  /**
   * Preload game images before start.
   * - When `isLoading` is true, caches all required images.
   * - On success: dispatches `set_loading()` to update Redux.
   * - On failure: reloads page to retry.
   */
  useEffect(() => {
    if (!isLoading) return;

    // Function to preload imgs
    preloadImages(imgNames)
      .then(() => {
        dispatch(
          // Set loading to false after imgs were loaded
          set_loading()
        );
      })
      .catch((err) => {
        // setError(err.message);    // save error message / or show message ..hm
        console.log("Not all images were loaded", err);
        // setLoadingImg(false);        //-----------------------------------------set loading to false

        // Reload page for simple retry logic on error
        window.location.reload();
      });
  }, [isLoading, imgNames, dispatch]);

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
              <Route element={<SharedLayout />}>
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
