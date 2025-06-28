import { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@pexeso/lib/firebase/firestoreConfigUsers";
import { useNavigate, useParams } from "react-router-dom";

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { lang } = useParams();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setError("");
      navigate(`/${lang}/game`);
    } catch (e) {
      const err = e as FirebaseError;
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/invalid-credentials":
          setError("Email alebo heslo je nesprávne.");
          break;
        case "auth/too-many-requests":
          setError("Príliš veľa pokusov. Skúste znova neskôr.");
          break;
        case "auth/network-request-failed":
          setError("Sieťová chyba. Skontrolujte pripojenie.");
          break;
        default:
          setError("Pri prihlasovaní nastala neznáma chyba.");
      }
    }
  };

  return (
    <Box sx={sxStyles.form}>
      <TextField
        label="Email"
        sx={sxStyles.input}
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <TextField
        label="Heslo"
        type={showPassword ? "text" : "password"}
        sx={sxStyles.input}
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button variant="contained" fullWidth onClick={handleLogin}>
        Prihlásiť sa
      </Button>
    </Box>
  );
};

export default Login;
