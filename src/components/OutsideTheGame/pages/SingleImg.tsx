import { useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { pulsatingButtonStyles } from "@pexeso/components/StylingComp/SharedStyles";
import { useImgValidation } from "@pexeso/_inc/hooks/UseImgValidation";

/**
 * SingleImg Page Component
 *
 * Renders a single Pexeso image based on the current route param.
 *
 * Behavior:
 * - Shows the image with a back button if the name is valid.
 * - Shows an error message + back button if the name is invalid.
 *
 * @component
 * @example
 * <SingleImg />
 *
 * @dependencies
 * - @mui/material (Box, Typography, Button)
 * - react-i18next (translations)
 * - react-router-dom (Link, useParams)
 * - react-redux (via custom validation hook)
 *
 * @remarks
 * - Image name is validated inside `useImgValidation`.
 * - Title is dynamically capitalized from the image name.
 */

// ---------- Sx styles

// Container for the whole single image page
const singleImgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "60vh"
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

  // ---------- EFFECT TO VALIDATE IMAGE ----------
    const { errorImgName, imgNameH3, imageName } = useImgValidation();

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
              src={`/pictures/pexeso/${imageName}.jpg`}
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
