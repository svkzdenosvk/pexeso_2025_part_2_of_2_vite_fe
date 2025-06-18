import { useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { Link } from "react-router-dom";
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


// ---------- sx styles

const imgContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
} as const;

const imgMainContentStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  gap: "1%",
};

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

// ---------- component

const Images = () => {
  const { t } = useTranslation();

  const { isLoading, imgNames } = useSelector((state: RootState) => state.game); //-------------with destructuring

  return (
    <Box sx={imgContentStyles}>
      <Typography variant="h2" component="h2">
        {t("images_page.h2")}
      </Typography>

      <Box sx={imgMainContentStyles}>
        {isLoading || imgNames.length === 0 ? (
          <Typography variant="h4" component="h4">
            {t("images_page.loading")}
          </Typography>
        ) : (
          //--------------------------------------------------------------------------------after loading show images
          imgNames.map((oneImgName) => (
            <Box key={oneImgName}>
              {/* link from img */}
              <Button
                component={Link}
                to={`/about-game/images/${oneImgName}`}
                variant="contained"
                sx={btnLinkStyles}
              >
                {/* img */}
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
