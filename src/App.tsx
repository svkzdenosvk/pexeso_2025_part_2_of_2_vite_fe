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
import { /*fetchOnlyImgNames,*/ preloadImages } from "@pexeso/_inc/data";
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
import GameSettings from "@pexeso/components/RelatedToGame/GameSettings";
import Rules from "@pexeso/components/OutsideTheGame/pages/Rules";
import SharedAboutLayout from "@pexeso/components/OutsideTheGame/layouts/SharedAboutLayout";
import SharedLangLayout from "@pexeso/components/OutsideTheGame/layouts/SharedLangLayout";
import AboutGame from "@pexeso/components/OutsideTheGame/pages/AboutGame";
import Images from "@pexeso/components/OutsideTheGame/pages/Images";
import SingleImg from "@pexeso/components/OutsideTheGame/pages/SingleImg";
import ErrorPage from "@pexeso/components/OutsideTheGame/pages/ErrorPage";
import Registration from "@pexeso/components/LogReg/Registration";
import Login from "@pexeso/components/LogReg/Login";

// ---------- component

const App = () => {
  const { i18n } = useTranslation();
  //------------------------------------redux-----------------------------------------
  const dispatch = useDispatch();

  const {
    imgNames,
    isLoading,
    theme: localVariableTheme,
    isEnd,
  } = useSelector((state: RootState) => state.game); //---with destructuring

  //---names of importing hemes
  const importedThemes: Record<My_Type_Theme, typeof defaultTheme> = {
    defaultTheme,
    mediumTheme,
    hardTheme,
  };

  //current theme set from redux (help from chatGPT)
  const currentTheme =
    importedThemes[localVariableTheme as My_Type_Theme] ?? defaultTheme;

  //------------------------------------------------------------------------------------------------------------

  //dynamic styles

  const dynamicWrapperStyles = {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: isEnd ? "center" : "flex-start",
  };

  //------------------------------------------------------------------------------------------------------------

  
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user?.email) {
      try {
        const docRef = doc(projectUsers, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {

          //sign out user without profile in Firestore
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
        // error during checking of profile in Firestore
        console.error("Error during checking of profile in Firestore:", err);
        dispatch(clearUser());
      }
    } else {
      //user is logged out so could be clear also in redux
      dispatch(clearUser());
    }
  });

  return () => unsubscribe(); // cleanup
}, [dispatch]);

  useEffect(() => {
    if (!isLoading) return;

    //function to preload imgs
    preloadImages(imgNames)
      .then(() => {
        dispatch(
          //set loading to false after imgs were loaded
          set_loading()
        );
      })
      .catch((err) => {
        // setError(err.message);    // save error message / or show message ..hm
        console.log("Not all images were loaded", err);
        // setLoadingImg(false);        //-----------------------------------------set loading to false
        //reload page when imgs weren´t loaded correctly
        window.location.reload();
      });
  }, [isLoading, imgNames, dispatch]);

  //redirect with right lang prefix
  const storedLocalStorageLang = localStorage.getItem("lang");
  const setlang =
    storedLocalStorageLang || i18n.language || LANGUAGE_CONFIG.fallbackLang;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      <Box sx={dynamicWrapperStyles}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={`/${setlang}`} replace />} />

            <Route path="/:lang" element={<SharedLangLayout />}>
              <Route path="game" element={<Game />} />

              <Route element={<SharedLayout />}>
                <Route index element={<Home />} />
                <Route path="settings" element={<GameSettings />} />
                <Route path="login" element={<Login />} />
                <Route path="registration" element={<Registration />} />

                <Route path="about-game" element={<SharedAboutLayout />}>
                  <Route index element={<AboutGame />} />
                  <Route path="rules" element={<Rules />} />

                  <Route path="images" element={<Images />} />
                  <Route path="images/:name" element={<SingleImg />} />
                </Route>
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
