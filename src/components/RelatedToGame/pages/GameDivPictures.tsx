import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { My_Type_DivImg } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";
import {
  showOne,
  match,
  un_match,
  hardest_level_shuffle,
} from "@pexeso/lib/redux/store/reducers/gameSlice";
// import { MyMUIImg } from "@pexeso/components/SharedMUIElements/MyMUIImg";

// ---------- sx styles

const imgStyles = {
  width: "107px",
  height: "107px",
  opacity: "0%",
} as const;

const divOnCliCkBoxStyles = {
  width: "107px",
  height: "107px",
  position: "relative",
  borderRadius: 2,
  overflow: "hidden",
} as const;

const rowStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  flex: "1 1 50%",
  mt: "1.5%",
} as const;

const colorTextThemeStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

// ---------- component

export const GameDivPictures = () => {
  const { t } = useTranslation();

  // ---------------------------redux

  const { divImgs, level, isLoading } = useSelector(
    (state: RootState) => state.game
  ); //-------------with destructuring

  const dispatch = useDispatch();

  /*-------------------------------------------------------------------------------------------------*/

  // --------fn to show div>img
  function showImg(element: HTMLDivElement, divObject: My_Type_DivImg) {
    /* after match */
    const selectedArr = divImgs.filter((oneDiv) =>
      oneDiv.classNames.includes("selected_Div_img")
    );
    const rotateddArr = divImgs.filter((oneDiv) =>
      oneDiv.classNames.includes("rotate-center")
    );

    if (
      /*-------------if divImg is not selected + prevent 3 imgs show*/
      element.classList.contains("mask") &&
      (selectedArr.length === 0 || selectedArr.length === 1) &&
      rotateddArr.length === 0
    ) {
      dispatch(showOne(divObject));
    }
  }

  useEffect(() => {
    setTimeout(function () {
      const selectedArr: My_Type_DivImg[] = divImgs.filter((oneDiv) =>
        oneDiv.classNames.includes("selected_Div_img")
      );

      if (selectedArr.length === 2) {
        /* --------------------if match */
        if (selectedArr[0].name === selectedArr[1].name) {
          dispatch(match());
        } else {
          /* ------------------else if unmatch */

          dispatch(un_match(level));
        }
      }

      document.body.style.pointerEvents =
        "auto"; /*---------------------------------------------------------------give back functionality to pointer*/
    }, 200);

    //-------------------------in the hardest level shuffeling every 400 ms
    if (level === "hard") {
      const intervalShuffleHardest = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);

      return () => clearInterval(intervalShuffleHardest);
    }
  }, [dispatch, divImgs, level]);

  return (
    <Box className="row" id="row" sx={rowStyles}>
      {/* during loading show message */}
      {isLoading ? (
        <Typography variant="h2" component="h2" sx={colorTextThemeStyles}>
          {t("images_page.loading")}
        </Typography>
      ) : (
        // images to play
        divImgs.map(
          (
            oneDiv: My_Type_DivImg //-------------------------------------------array of img names -> div>img
          ) => (
            <Box
              sx={divOnCliCkBoxStyles}
              key={oneDiv.id}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                const currentDiv = e.currentTarget; // --------------------------this is always <div> with `div_on_click`
                showImg(currentDiv, oneDiv);
              }}
              className={oneDiv.classNames.join(" ")}
            >
              <Box
                component="img"
                src={`/pictures/pexeso/${oneDiv.name}.jpg`}
                alt="Pexeso img"
                sx={imgStyles}
              />
            </Box>
          )
        )
      )}
    </Box>
  );
};
