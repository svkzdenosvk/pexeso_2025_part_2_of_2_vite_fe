import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  signOut,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import PublicOnlyRoute from "./PublicOnlyRoute";

/**
 * Registration Component
 *
 * Provides a registration form for creating a new user account.
 *
 * Responsibilities:
 * - Renders form fields: name, email, password, confirm password
 * - Validates user input (length, format, password strength, match)
 * - Checks for existing email in Firebase Authentication
 * - Creates user in Firebase Authentication and stores profile in Firestore
 * - Logs the user out after registration and redirects to the login page
 * - Displays errors and loading states
 *
 * Notes:
 * - Wrapped with PublicOnlyRoute to prevent logged-in users from accessing it
 * - Password visibility toggle included for better UX
 * - Uses translation keys for all labels and error messages
 *
 * @component
 * @dependencies
 * - react-router-dom (useNavigate, useParams)
 * - react-i18next (useTranslation)
 * - @mui/material (TextField, Button, Alert, Box, IconButton, InputAdornment, CircularProgress)
 * - @mui/icons-material (Visibility, VisibilityOff)
 * - firebase/auth (fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signOut)
 * - firebase/firestore (doc, setDoc, serverTimestamp)
 * - Firebase config (auth, projectUsers)
 * - PublicOnlyRoute (wrapper for public-only access)
 *
 * @example
 * <Registration />
 */

// ---------- Sx styles

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};
// ---------- Component

export const Registration = () => {
  // Local loading state to disable submit button & show spinner
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  // Navigation & route language param
  const navigate = useNavigate();
  const { lang } = useParams();

  // Form state (controlled inputs)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Error message (translation key)
  const [error, setError] = useState("");
  // Toggles password visibility
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validates registration form values.
   * @returns string - translation key for error message, or empty string if valid
   */
  const validate = () => {
    const { password, confirm, name, email } = form;
    if (name.length < 3) return "reg_page.error_alert.name_length_min";
    if (name.length > 50) return "reg_page.error_alert.name_length_max";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "reg_page.error_alert.email_format";
    if (password.length < 6 || password.length > 20)
      return "reg_page.error_alert.pass_length";
    if (!/[A-Z]/.test(password)) return "reg_page.error_alert.pass_upper";
    if (!/[!@#$%^&*-]/.test(password))
      return "reg_page.error_alert.pass_special";
    if (password !== confirm) return "reg_page.error_alert.pass_confirm";
    return "";
  };

  /**
   * Handles registration process:
   * 1. Validates input
   * 2. Checks if email is already registered
   * 3. Creates Firebase Auth user
   * 4. Saves profile in Firestore
   * 5. Signs out and redirects to login
   */
  const handleRegister = async () => {
    setIsLoading(true); // prevent double click on register btn and trigger error email already registered
    setError(""); // reset error

    // Client-side validation - error from validate function
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      // stop loading if validation fails  -> prevent never ending disabled reg. button
      setIsLoading(false);
      return;
    }

    try {
      // Check if email already exists in Firebase Auth (Authentication in Firebase console)
      const methods = await fetchSignInMethodsForEmail(auth, form.email);
      if (methods.length > 0) {
        return setError("reg_page.error_alert.email_registered");
      }

      // Create user in Firebase Auth (Authentication in Firebase console)
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const newUser = res.user;

      try {
        // Save user profile in Firestore
        await setDoc(doc(projectUsers, "users", newUser.uid), {
          name: form.name,
          email: form.email,
          createdAt: serverTimestamp(),
        });

        // Sign out and redirect to login
        await signOut(auth);
        setError("");
        setForm({ name: "", email: "", password: "", confirm: "" });
        navigate(`/${lang}/login`, { state: { fromRegister: true } });
      } catch (firestoreError) {
        console.error("User not saved in Firestore:", firestoreError);

        // If Firestore save failed, remove user from Auth
        try {
          await newUser.delete();
          console.log(
            "User successfully deleted from Auth after Firebase error"
          );
        } catch (deleteError) {
          console.error("Deleting user from Auth failed:", deleteError);
        }

        setError("reg_page.error_alert.reg_failed");
      }
    } catch (e) {
      // Handle Firebase Auth errors
      const err = e as FirebaseError;
      console.error("Firebase Error:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("reg_page.error_alert.email_registered");
      } else {
        setError("reg_page.error_alert.unexpected");
      }
    } finally {
      setIsLoading(false); // Always stop loading
    }
  };

  return (
    <PublicOnlyRoute>
      <Box sx={sxStyles.form}>
        {/* Name input */}
        <TextField
          label={t("reg_page.label.name")}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        {/* Email input */}
        <TextField
          label={t("reg_page.label.email")}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        {/* Password input with visibility toggle */}
        <TextField
          label={t("reg_page.label.pass")}
          type={showPassword ? "text" : "password"}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          slotProps={{
            input: {
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
            },
          }}
        />
        {/* Confirm password input */}
        <TextField
          label={t("reg_page.label.pass_conf")}
          type="password"
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
        />
        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error)}
          </Alert>
        )}
        {/* Submit button with spinner */}
        <Button
          sx={{ px: 1, py: 2, fontWeight: "bold" }}
          variant="contained"
          fullWidth
          onClick={handleRegister}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />} //loading spinner
        >
          {t("reg_page.btn_reg")}
        </Button>
      </Box>
    </PublicOnlyRoute>
  );
};

export default Registration;
