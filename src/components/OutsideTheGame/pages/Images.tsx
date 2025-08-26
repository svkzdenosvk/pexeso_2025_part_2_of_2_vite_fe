import { useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { Link, useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

// import drop from '@assets/pictures/drop.jpg';
// import lightning from '@assets/pictures/lightning.jpg';
// import wood from '@assets/pictures/wood.jpg';
// import wind from '@assets/pictures/wind.jpg';
// import vibration from '@assets/pictures/vibration.jpg';
// import sun from '@assets/pictures/sun.jpg';
// import space from '@assets/pictures/space.jpg';
// import sea from '@assets/pictures/sea.jpg';

/**
 * Images Page Component
 *
 * Displays a gallery of all available Pexeso images.
 *
 * Responsibilities:
 * - Fetches image names and loading state from Redux store.
 * - Shows loading text while images are being fetched.
 * - Renders a grid of clickable images, each linking to its detail page.
 * - Provides hover effects and styling for visual feedback.
 *
 * @component
 * @example
 * <Images />
 *
 * @dependencies
 * - react-redux (useSelector for game state)
 * - react-router-dom (Link, useParams for navigation & localization)
 * - react-i18next (useTranslation for i18n support)
 * - @mui/material (Box, Typography, Button)
 */

// ---------- Sx styles

// Wrapper for whole page layout
const imgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

// Grid container for all images
const imgMainContentStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  gap: "1%",
};

// Button wrapper styling
const btnLinkStyles = {
  mb: 2,
  p: 0,
  backgroundColor: "white",
  textDecoration: "none",
  outline: "none",
  boxShadow: "none",
  border: "none",
  "&:hover": {
    boxShadow: "none",
  },
} as const;

// Single image preview
const imgStyles = {
  width: 200,
  height: 200,
  borderRadius: 2,
  overflow: "hidden",
  position: "relative",

  transition: "box-shadow 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0px 0px 28px 19px goldenrod",
  },
} as const;

// ---------- Component

const Images = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  // Extract loading state and image names from Redux
  const { isLoading, imgNames } = useSelector((state: RootState) => state.game); //-------------with destructuring

  return (
    <Box sx={imgContentStyles}>
      {/* Page headline */}
      <Typography variant="h2" component="h2">
        {t("images_page.h2")}
      </Typography>

      <Box sx={imgMainContentStyles}>
        {/* Show loading state or images */}
        {isLoading || imgNames.length === 0 ? (
          <Typography variant="h4" component="h4">
            {t("images_page.loading")}
          </Typography>
        ) : (
          imgNames.map((oneImgName) => (
            <Box key={oneImgName}>
              {/* Each image wrapped in a link to its detail page */}
              <Button
                component={Link}
                to={`/${lang}/about-game/images/${oneImgName}`}
                variant="contained"
                sx={btnLinkStyles}
              >
                {/* Render image preview */}
                <Box
                  component="img"
                  src={`/pictures/pexeso/${oneImgName}.jpg`}
                  alt="Pexeso img"
                  sx={imgStyles}
                />
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Images;
