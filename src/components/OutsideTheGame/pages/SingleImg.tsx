import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { my_Type_Guard_function } from "@pexeso/_inc/_inc_functions";
import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";

/**
 * SingleImg Page Component
 *
 * Displays a single Pexeso image based on the URL parameter.
 * Handles both valid and invalid image names:
 * - If the image exists, shows the image with a back button.
 * - If the image does not exist, shows an error message with a back button.
 * The page title (H3) is dynamically generated from the image name.
 *
 * @component
 * @example
 * <SingleImg />
 *
 * @remarks
 * - Image name is validated against Redux state `imgNames`.
 * - Translations handled via `react-i18next`.
 * - Responsive layout using MUI `Box` and `sx` props.
 * - Error and success states rendered conditionally.
 *
 * @dependencies
 * - @mui/material (Box, Typography, Button)
 * - react-i18next
 * - react-router-dom (Link, useParams)
 * - react-redux (useSelector)
 */

// ---------- Sx styles

// Container for the whole single image page
const singleImgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

// Main content area for image and button
const singleImgMainContentStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
} as const;

// Style for the image itself
const imgStyles = {
  width: "200px",
  height: "200px",
  overflow: "hidden",
  position: "relative",
  borderRadius: 2,
} as const;

// ---------- Component

const SingleImg = () => {
  const { t } = useTranslation();
  const { lang } = useParams(); // language from URL

  const params = useParams();
  // Get image name param safely
  const name = typeof params?.name === "string" ? params.name : undefined;
  // Get all image names from Redux store
  const { imgNames } = useSelector((state: RootState) => state.game);

  // ---------- LOCAL STATE ----------
  const [errorImgName, setErrorImgName] = useState(false); // whether the image name is invalid
  const [imgNameH3, setNameH3] = useState(""); // header text for the image

  // ---------- EFFECT TO VALIDATE IMAGE ----------
  useEffect(() => {
    // If name param is missing or not a string
    if (!name || typeof name !== "string") {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist")); // show error title
      return;
    }

    // If name is not in imgNames array
    if (!my_Type_Guard_function(name, imgNames)) {
      setErrorImgName(true);
      setNameH3(t("single_img_page.h2.not_exist")); // show error title
    } else {
      // If valid image, display its title
      setErrorImgName(false);
      const displayName: string = name;

      setNameH3(t(`single_img_page.h2.${displayName}`)); // dynamic header translation
    }
  }, [name, imgNames, t]);

  return (
    <Box sx={singleImgContentStyles}>
      {/* ---------- Page Title ---------- */}
      {/* First letter capitalized for display */}
      <Typography variant="h3" component="h3">
        {imgNameH3.charAt(0).toUpperCase() + imgNameH3.slice(1)}
      </Typography>
      <Box sx={singleImgMainContentStyles}>
        {/* ---------- ERROR STATE ---------- */}
        {errorImgName ? (
          <>
            {/* Error message if image is not found */}
            <Typography variant="h3" component="h3">
              {t("single_img_page.h3_error")}
            </Typography>

            {/* Button to go back to images page */}
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
          /* ---------- SUCCESS STATE ---------- */
          <>
            {/* Display the image */}
            <Box
              component="img"
              src={`/pictures/pexeso/${name}.jpg`}
              alt="Pexeso img"
              sx={imgStyles}
            />
            
            {/* Button to go back to images page */}
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
