import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";

const TranslateButtons = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = i18n.language;

  //onClick function to change language, save l. to localStorage and rewrite lang prefix 
  const changeLanguage = (lng: string) => {

    i18n.changeLanguage(lng);
    const pathParts = location.pathname.split("/").filter(Boolean); // for ex. ["de", "images"]
    const restOfPath = pathParts.slice(1).join("/");

    //save in localStorage
    localStorage.setItem("lang", lng!);

    //redirect with new lang prefix
    navigate(`/${lng}/${restOfPath}`);
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ButtonGroup
        variant="outlined"
        color="primary"
        sx={{
          boxShadow: 3,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {LANGUAGE_CONFIG.languages.map((lng) => (
          <Button
            key={lng}
            onClick={() => changeLanguage(lng)}
            variant={currentLang === lng ? "contained" : "outlined"}
            sx={{
              textTransform: "uppercase",
              fontWeight: "bold",
              px: 2,
              py: 1,
              fontSize: "0.85rem",
              minWidth: 50,
            }}
          >
            {lng}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default TranslateButtons;
