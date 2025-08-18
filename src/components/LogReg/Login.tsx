import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { reset_settings } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { setUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import PublicOnlyRoute from "./PublicOnlyRoute";

/**
 * Login Component
 *
 * Provides a login form for existing users.
 *
 * Responsibilities:
 * - Renders form fields: email, password
 * - Handles user login via Firebase Authentication
 * - Retrieves user profile from Firestore
 * - Stores user in Redux store upon successful login
 * - Displays success messages (e.g., after registration) and error messages
 * - Manages loading state and password visibility toggle
 *
 * Notes:
 * - Wrapped with PublicOnlyRoute to prevent logged-in users from accessing it
 * - Uses translation keys for all labels and error messages
 *
 * @component
 * @dependencies
 * - React & React Router: react, react-router-dom
 * - State & i18n: react-redux, react-i18next
 * - UI components: @mui/material, @mui/icons-material
 * - Firebase: firebase/auth, firebase/firestore
 * - Redux slice: setUser
 * - PublicOnlyRoute wrapper
 *
 * @example
 * <Login />
 */

// ---------- Sx styles

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

// ---------- Component

export const Login = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // loading state during login
  const location = useLocation(); // get current location (for redirect state)
  const [form, setForm] = useState({ email: "", password: "" }); // form state
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lang } = useParams(); // get lang param from route
  const [showSuccess, setShowSuccess] = useState(false); // show success message (e.g., after register)

  // Reset settings from the game
  useEffect(() => {
    dispatch(reset_settings()); // reset game configuration
  }, [location.pathname, dispatch]);

  // ---------- Effect: Show success message after registration
  useEffect(() => {
    if (location.state?.fromRegister) {
      setShowSuccess(true);

      // Remove state (flag) from history to prevent showing alert after refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ---------- Function: Handle login
  const handleLogin = async () => {
    setIsLoading(true); // start loading
    setError(""); // clear previous errors

    try {
      // Firebase authentication
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Fetch user profile from Firestore
      const docSnap = await getDoc(doc(projectUsers, "users", res.user.uid));
      const data = docSnap.data();

      // Store user in Redux
      dispatch(
        setUser({
          uid: res.user.uid,
          name: data?.name ?? "",
          email: res.user.email ?? "",
        })
      );

      // Navigate to home page after successful login
      navigate(`/${lang}/`);
    } catch (e) {
      const err = e as FirebaseError;

      // Map Firebase error codes to translation keys
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/invalid-credentials":
          setError("login_page.error_alert.invalid_credentials");
          break;
        case "auth/too-many-requests":
          setError("login_page.error_alert.too_many_req");
          break;
        case "auth/network-request-failed":
          setError("login_page.error_alert.net_req_failed");
          break;
        default:
          setError("login_page.error_alert.unknow_err");
      }
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  return (
    <PublicOnlyRoute>
      <Box sx={{ mx: "auto" }}>
        {/* Success alert */}
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t("login_page.success_login")}
          </Alert>
        )}
        {/* Login form */}
        <Box sx={sxStyles.form}>
          {/* Email input */}
          <TextField
            label={t("reg_page.label.email")}
            sx={sxStyles.input}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />

          {/* Password input with visibility toggle */}
          <TextField
            label={t("reg_page.label.pass_conf")}
            type={showPassword ? "text" : "password"}
            sx={sxStyles.input}
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
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
          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t(error)}
            </Alert>
          )}
          {/* Submit button */}
          <Button
            sx={{ px: 1, py: 2, fontWeight: "bold" }}
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />} //loading spinner
          >
            {t("login_page.btn_login")}
          </Button>
        </Box>
      </Box>
    </PublicOnlyRoute>
  );
};

export default Login;
