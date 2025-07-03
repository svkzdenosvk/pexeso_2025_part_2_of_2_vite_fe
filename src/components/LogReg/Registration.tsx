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

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

// ---------- component

export const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // function to validate form and return error
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

  const handleRegister = async () => {
    //prevent double click on register btn and trigger error email already registered
    setIsLoading(true);
    setError(""); // reset error

    //error from validate function
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      // if error set loading to false -> prevent never ending disabled reg. button
      setIsLoading(false);
      return;
    }

    try {
      //check whether email exists in Auth (Authentication in Firebase console)
      const methods = await fetchSignInMethodsForEmail(auth, form.email);
      if (methods.length > 0) {
        return setError("reg_page.error_alert.email_registered");
      }

      // create user in Auth (Authentication in Firebase console)
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const newUser = res.user;

      try {
        //save in Firestore
        await setDoc(doc(projectUsers, "users", newUser.uid), {
          name: form.name,
          email: form.email,
          createdAt: serverTimestamp(),
        });

        //logg out and redirect
        await signOut(auth);
        setError("");
        setForm({ name: "", email: "", password: "", confirm: "" });
        navigate(`/${lang}/login`, { state: { fromRegister: true } });
      } catch (firestoreError) {
        console.error("User not saved in Firestore:", firestoreError);

        //if Firestore save failed, delete user from Auth
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
      const err = e as FirebaseError;
      console.error("Firebase Error:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("reg_page.error_alert.email_registered");
      } else {
        setError("reg_page.error_alert.unexpected");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicOnlyRoute>
      <Box sx={sxStyles.form}>
        <TextField
          label={t("reg_page.label.name")}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <TextField
          label={t("reg_page.label.email")}
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

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

        <TextField
          label={t("reg_page.label.pass_conf")}
          type="password"
          sx={sxStyles.input}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t(error)}
          </Alert>
        )}
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
