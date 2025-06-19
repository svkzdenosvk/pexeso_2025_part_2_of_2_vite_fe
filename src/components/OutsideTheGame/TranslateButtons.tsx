 import { /*Navigate,*/ useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const TranslateButtons = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // const newLang = i18n.language;
    const pathParts = location.pathname.split("/").filter(Boolean); // napr. ["de", "images"]
    const restOfPath = pathParts.slice(1).join("/");
    console.log(`/${lng}/${restOfPath}`);
    //  <Navigate to={`/${lng}/${restOfPath}`} />;
     navigate(`/${lng}/${restOfPath}`)
  };

  const languages = ["en", "sk", "de"];

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
        {languages.map((lng) => (
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
