import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useResetSettings } from "@pexeso/_inc/hooks/UseResetSettings";
import { useRegistrationSuccess } from "@pexeso/_inc/hooks/UseRegistrationSuccess";
import { handleLogin } from "@pexeso/_inc/functions/login_related";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/functions/general";
import PublicOnlyRoute from "../PublicOnlyRoute";
import type { My_Type_Lang } from "@pexeso/_inc/my_types";
import { useSelector } from "react-redux";
import { selectBackendUrl } from "@pexeso/lib/redux/store/reducers/backendSlice";

/**
 * Login Component
 *
 * Provides a login form for existing users.
 *
 * Responsibilities:
 * - Renders form fields: email, password
 * - Calls `handleLogin` helper to perform login
 *   (server-side authentication via Express, PostgreSQL/Prisma)
 * - Displays success messages (e.g., after registration) and error messages
 * - Manages local UI state (form values, loading state, password visibility)
 * - Validates and falls back the language param using a type guard
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
 * - Helper: handleLogin (auth + PostgreSQL/Prisma logic)
 * - Custom hooks: useResetSettings, useRegistrationSuccess
 * - Type guard: my_Type_Guard_function_isValidLang
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
  const [form, setForm] = useState({ email: "", password: "" }); // form state
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lang } = useParams<{ lang?: string }>(); // get lang param from route
  const safeLang: My_Type_Lang = my_Type_Guard_function_isValidLang(lang)
    ? lang
    : "en"; // fallback

  //dynamic be URL from Redux
  const backendUrl = useSelector(selectBackendUrl);

  // Reset settings from the game by own hook
  useResetSettings();

  // Effect: Show success message after registration
  const showSuccess = useRegistrationSuccess();

  // Function: Handle login
  const onLogin = () => {
    handleLogin({
      email: form.email,
      password: form.password,
      lang: safeLang,
      dispatch,
      setError,
      setIsLoading,
       backendUrl,  
      navigation: () => navigate(`/${safeLang}/`),
    });
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
            onClick={onLogin}
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
