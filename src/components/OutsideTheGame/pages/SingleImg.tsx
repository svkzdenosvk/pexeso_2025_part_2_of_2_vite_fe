import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { my_Type_Guard_function } from "@pexeso/_inc/_inc_functions";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";

// ---------- sx styles

const singleImgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

const singleImgMainContentStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
} as const;

const imgStyles = {
  width: "200px",
  height: "200px",
  overflow: "hidden",
  position: "relative",
  borderRadius: 2,
} as const;

// ---------- component

const SingleImg = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  const params = useParams();
  const name = typeof params?.name === "string" ? params.name : undefined;

  const { imgNames } = useSelector((state: RootState) => state.game);

  const [errorImgName, setErrorImgName] = useState(false);
  const [imgNameH3, setNameH3] = useState("");

  //error if img doesn´t exist
  useEffect(() => {
    if (!name || typeof name !== "string") {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist"));
      return;
    }

    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist"));
    } else {
      // if not error set H3 from param (name of picture)
      setErrorImgName(false);
      const displayName: string = name;

      setNameH3(t(`single_img_page.h2.${displayName}`));
    }
  }, [name, imgNames, t]);

  return (
    <Box sx={singleImgContentStyles}>
      {/* //the first letter is capitalized */}
      <Typography variant="h3" component="h3">
        {imgNameH3.charAt(0).toUpperCase() + imgNameH3.slice(1)}
      </Typography>
      <Box sx={singleImgMainContentStyles}>
        {/* if error */}
        {errorImgName ? (
          <>
            <Typography variant="h3" component="h3">
              {t("single_img_page.h3_error")}
            </Typography>
            <Button
              component={Link}
              to={`/${lang}/about-game/images`}
              variant="contained"
              sx={pulsatingButtonStyles}
            >
              {t("single_img_page.btn.btn_error")}
            </Button>
          </>
        ) : (
          //  if not error
          <>
            <Box
              component="img"
              src={`/pictures/pexeso/${name}.jpg`}
              alt="Pexeso img"
              sx={imgStyles}
            />
            <Button
              component={Link}
              to={`/${lang}/about-game/images`}
              variant="contained"
              sx={pulsatingButtonStyles}
            >
              {t("single_img_page.btn.btn_back")}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleImg;
