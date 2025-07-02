import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import PublicOnlyRoute from "./PublicOnlyRoute";

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

// ---------- component

export const Login = () => {
  const location = useLocation(); // when U navigate with state, then on new page U can get state with useLocation

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lang } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

  //show successfull message from register
  useEffect(() => {
    if (location.state?.fromRegister) {
      setShowSuccess(true);

      // delete state (flag) from history, alert not exists after refresh 
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const docSnap = await getDoc(doc(projectUsers, "users", res.user.uid));
      const data = docSnap.data();
      
      //setup user in redux
      dispatch(
        setUser({
          uid: res.user.uid,
          name: data?.name ?? "",
          email: res.user.email ?? "",
        })
      );

      setError("");
      navigate(`/${lang}/`);
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
    <PublicOnlyRoute>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registrácia prebehla úspešne. Teraz sa môžete prihlásiť.
        </Alert>
      )}
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
        <Button sx={{  px: 1, py: 2, fontWeight: 'bold'}} variant="contained" fullWidth onClick={handleLogin}>
          Prihlásiť sa
        </Button>
      </Box>
    </PublicOnlyRoute>
  );
};

export default Login;
