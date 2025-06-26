import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

// 🧑 Štýly mimo JSX
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

export const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 3;
    const isShortEnough = password.length <= 20;

    return hasUpper && hasSpecial && isLongEnough && isShortEnough;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pass !== passConfirm) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    if (!validatePassword(pass)) {
      setError("Heslo musí mať 3–20 znakov, 1 veľké písmeno a 1 špeciálny znak.");
      return;
    }

    setError(""); // ✅ všetko ok – tu neskôr voláš Firebase
    console.log({ name, email, pass });
  };

  return (
    <Box sx={styles.container} component="form" onSubmit={handleSubmit}>
      <Typography variant="h5">Registrácia</Typography>

      <TextField
        label="Meno"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <TextField
        label="Potvrdenie hesla"
        type="password"
        value={passConfirm}
        onChange={(e) => setPassConfirm(e.target.value)}
        required
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" color="primary">
        Registrovať
      </Button>
    </Box>
  );
};

export default Registration;
