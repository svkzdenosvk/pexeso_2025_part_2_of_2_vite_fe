import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Box } from "@mui/material";
import { fetchOnlyImgNames, preloadImages } from "@pexeso/_inc/data";
import type { My_Type_Theme } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";
import {
  set_img_names,
  set_loading,
} from "@pexeso/lib/redux/store/reducers/gameSlice";
// import { GlobalStyle } from "@pexeso/components/StylingComp/GlobalStyle";
import { defaultTheme } from "@pexeso/components/StylingComp/themes/defaultTheme";
import { mediumTheme } from "@pexeso/components/StylingComp/themes/mediumTheme";
import { hardTheme } from "@pexeso/components/StylingComp/themes/hardTheme";
import Game from "@pexeso/components/RelatedToGame/pages/Game";
import SharedLayout from "@pexeso/components/OutsideTheGame/layouts/SharedMainLayout";
import Home from "@pexeso/components/OutsideTheGame/pages/Home";
import GameSettings from "@pexeso/components/RelatedToGame/GameSettings";
import Rules from "@pexeso/components/OutsideTheGame/pages/Rules";
import SharedAboutLayout from "@pexeso/components/OutsideTheGame/layouts/SharedAboutLayout";
import AboutGame from "@pexeso/components/OutsideTheGame/pages/AboutGame";
import Images from "@pexeso/components/OutsideTheGame/pages/Images";
import SingleImg from "@pexeso/components/OutsideTheGame/pages/SingleImg";
import ErrorPage from "@pexeso/components/ErrorPage";

const App = () => {
  //------------------------------------redux-----------------------------------------

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

  const dispatch = useDispatch();
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

  useEffect(() => {
    const fetchImgNamesFunc = async () => {
      try {
        const fetchedImgNames = await fetchOnlyImgNames(); // ----------------------loading img names from firebase

        dispatch(set_img_names(fetchedImgNames));
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchImgNamesFunc(); //--------------------------------------------------------to call async f.
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) return;

    preloadImages(
      imgNames
    ) /*---------------------------------------------------------------------------function to preload imgd */
      .then(() => {
        dispatch(
          set_loading()
        ); /*----------------------------------------------------------------------set loading to false after imgs were loaded*/
      })
      .catch((err) => {
        // setError(err.message);    // save error message
        console.log("Not all images were loaded", err);
        // setLoadingImg(false);        //-----------------------------------------set loading to false
        window.location.reload(); //-----------------------------------------------reload page when imgs weren´t loaded correctly
      });
  }, [isLoading, imgNames, dispatch]); //-------------------------------------------if problems -> try only imgNames or nothing

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      <Box sx={dynamicWrapperStyles}>
        <BrowserRouter>
          <Routes>
            <Route path="/game" element={<Game />} />

            <Route path="/" element={<SharedLayout />}>
              <Route index element={<Home />} />
              <Route path="/settings" element={<GameSettings />} />

              <Route path="/about-game" element={<SharedAboutLayout />}>
                <Route index element={<AboutGame />} />
                <Route path="/about-game/rules" element={<Rules />} />

                <Route path="/about-game/images" element={<Images />} />
                <Route
                  path="/about-game/images/:name"
                  element={<SingleImg />}
                />
              </Route>
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
