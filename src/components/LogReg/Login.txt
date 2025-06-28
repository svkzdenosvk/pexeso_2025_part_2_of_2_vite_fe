import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

// Reuse styled container
const styles = {
  container: {
    maxWidth: 400,
    margin: "0 auto",
    padding: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    border: "1px solid #ccc",
    borderRadius: 2,
  },
};

export const Login = () => {
  const location = useLocation();//Keď sa niekam navigate()-neš s state, tak na tej novej stránke to vieš získať cez useLocation():

  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.fromRegister) {
      setShowSuccess(true);

      // odstráň state z history, aby alert neprežil refresh
       navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Firebase login – neskôr pridáme
    if (!email.includes("@")) {
      setError("Zadaný email nie je registrovaný.");
      return;
    }

    if (pass.length < 3) {
      setError("Nesprávne heslo.");
      return;
    }

    setError("");
    console.log("✅ Prihlásený ako:", email);
  };

  return (
    <>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registrácia prebehla úspešne. Teraz sa môžete prihlásiť.
        </Alert>
      )}
      <Box sx={styles.container} component="form" onSubmit={handleLogin}>
        <Typography variant="h5">Prihlásenie</Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Heslo"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" color="primary">
          Prihlásiť sa
        </Button>
      </Box>
    </>
  );
};

export default Login;
