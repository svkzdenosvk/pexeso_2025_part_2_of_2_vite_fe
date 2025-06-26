import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

// Štýly mimo JSX
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
    p: 2,
    borderBottom: "1px solid #ddd",
  },
  linkButton: {
    textTransform: "none",
    fontSize: "1rem",
  },
};

export const ButtonLogReg = () => {
  // Neskôr zameníme za stav z Firebase / Redux
  const [userName, setUserName] = useState<string | null>(null);
  const { lang } = useParams();
//   const handleFakeLogin = () => setUserName("Zdenko");
  const handleLogout = () => setUserName(null);

  return (
    <Box sx={styles.wrapper}>
      <Typography variant="body1">
        {userName ? `Prihlásený: ${userName}` : "Hosť"}
      </Typography>

      {!userName ? (
        <>
          <Button
            component={Link}
            to={`/${lang}/registration`}
            variant="contained"
            sx={styles.linkButton}
          >
            Registrácia
          </Button>
          <Button
            component={Link}
            to={`/${lang}/login`}
            variant="contained"
            sx={styles.linkButton}
          >
            Prihlásenie{" "}
          </Button>
          
        </>
      ) : (
        <Button sx={styles.linkButton} onClick={handleLogout}>
          Odhlásiť sa
        </Button>
      )}
    </Box>
  );
};

export default ButtonLogReg;
