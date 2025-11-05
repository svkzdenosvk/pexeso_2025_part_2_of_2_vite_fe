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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useResetSettings } from "@pexeso/_inc/hooks/UseResetSettings";
import {
  handleRegister,
  validateRegistration,
} from "@pexeso/_inc/functions/register_related";
import type { My_Type_Lang } from "@pexeso/_inc/my_types";
import { my_Type_Guard_function_isValidLang } from "@pexeso/_inc/functions/general";
import PublicOnlyRoute from "../PublicOnlyRoute";

const sxStyles = {
  input: { mb: 2, width: "100%" },
  form: { maxWidth: 400, mx: "auto", mt: 4 },
};

export const Registration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();

  const safeLang: My_Type_Lang = my_Type_Guard_function_isValidLang(lang)
    ? lang
    : "en";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useResetSettings();

  const resetForm = () => setForm({ name: "", email: "", password: "", confirm: "" });

  const onRegister = async () => {
    const validationError = validateRegistration(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    await handleRegister({
      form,
      lang: safeLang,
      setError,
      setIsLoading,
      resetForm,
      navigate,
    });
  };

  return (
    <PublicOnlyRoute>
      <Box sx={sxStyles.form}>
        <fieldset disabled={isLoading} style={{ border: 0 }}>
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
            onClick={onRegister}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {t("reg_page.btn_reg")}
          </Button>
        </fieldset>
      </Box>
    </PublicOnlyRoute>
  );
};

export default Registration;


// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   TextField,
//   Button,
//   Alert,
//   Box,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useResetSettings } from "@pexeso/_inc/hooks/UseResetSettings";
// import { handleRegister, validateRegistration } from "@pexeso/_inc/functions/register_related"; 
// import type {
//   My_Type_Lang,
// } from  "@pexeso/_inc/my_types";
// import  {
// my_Type_Guard_function_isValidLang } from "@pexeso/_inc/functions/general"
// import PublicOnlyRoute from "../PublicOnlyRoute";

// /**
//  * Registration Component
//  *
//  * Provides a registration form for creating a new user account.
//  *
//  * Responsibilities:
//  * - Renders form fields: name, email, password, confirm password
//  * - Validates user input  with `validateRegistration` (length, format, password strength, match)
//  * - Checks for existing email in Firebase Authentication
//  * - Creates user in Firebase Authentication and stores profile in Firestore
//  * - Logs the user out after registration and redirects to the login page
//  * - Displays errors and loading states
//  * - Validates and falls back the language param using a type guard
//  *
//  * Notes:
//  * - Wrapped with PublicOnlyRoute to prevent logged-in users from accessing it
//  * - Password visibility toggle included for better UX
//  * - Uses translation keys for all labels and error messages
//  *
//  * @component
//  * @dependencies
//  * - React & React Router: react, react-router-dom
//  * - i18n: react-i18next
//  * - UI: @mui/material, @mui/icons-material
//  * - Firebase: auth (createUserWithEmailAndPassword, signOut, fetchSignInMethodsForEmail),
//  *             firestore (doc, setDoc, serverTimestamp)
//  * - Helpers: handleRegister, validateRegistration
//  * - Custom hook: useResetSettings
//  * - Type guard: my_Type_Guard_function_isValidLang
//  * - Wrapper: PublicOnlyRoute
//  *
//  * @example
//  * <Registration />
//  */

// // ---------- Sx styles

// const sxStyles = {
//   input: { mb: 2, width: "100%" },
//   form: { maxWidth: 400, mx: "auto", mt: 4 },
// };
// // ---------- Component

// export const Registration = () => {
//   // Local loading state to disable submit button & show spinner
//   const [isLoading, setIsLoading] = useState(false);

//   const { t } = useTranslation();

//   // Navigation & route language param
//   const navigate = useNavigate();
//   const { lang } = useParams<{ lang?: string }>(); // get lang param from route
//   const safeLang: My_Type_Lang = my_Type_Guard_function_isValidLang(lang)
//     ? lang
//     : "en"; // fallback

//   // Form state (controlled inputs)
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirm: "",
//   });

//   // Error message (translation key)
//   const [error, setError] = useState("");
//   // Toggles password visibility
//   const [showPassword, setShowPassword] = useState(false);

//   // Reset settings from the game by own hook
//   useResetSettings();

//    const resetForm = () => {
//     setForm({ name: "", email: "", password: "", confirm: "" });
//   };

//    /**
//    * Handles registration process:
//    * 1. Validates input
//    * 2. Checks if email is already registered
//    * 3. Creates Firebase Auth user
//    * 4. Saves profile in Firestore
//    * 5. Signs out and redirects to login
//    */
//    const onRegister = async () => {
//     // Client-side validation
//     /**
//    * Validates registration form values.
//    * @returns string - translation key for error message, or empty string if valid
//    */
//     const validationError = validateRegistration(form);
//     if (validationError) {
//       setError(validationError);
//       setIsLoading(false);
//       return;
//     }

//     await handleRegister({
//       form,
//       lang: safeLang,
//       navigate,
//       setError,
//       setIsLoading,
//       resetForm
//     });
//   };
 
//   return (
//     <PublicOnlyRoute>
//       <Box sx={sxStyles.form}>
//         {/* Name input */}
//         <TextField
//           label={t("reg_page.label.name")}
//           sx={sxStyles.input}
//           onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//         />
//         {/* Email input */}
//         <TextField
//           label={t("reg_page.label.email")}
//           sx={sxStyles.input}
//           onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//         />
//         {/* Password input with visibility toggle */}
//         <TextField
//           label={t("reg_page.label.pass")}
//           type={showPassword ? "text" : "password"}
//           sx={sxStyles.input}
//           onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//           slotProps={{
//             input: {
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPassword((show) => !show)}
//                     edge="end"
//                     aria-label="toggle password visibility"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             },
//           }}
//         />
//         {/* Confirm password input */}
//         <TextField
//           label={t("reg_page.label.pass_conf")}
//           type="password"
//           sx={sxStyles.input}
//           onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
//         />
//         {/* Error alert */}
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {t(error)}
//           </Alert>
//         )}
//         {/* Submit button with spinner */}
//         <Button
//           sx={{ px: 1, py: 2, fontWeight: "bold" }}
//           variant="contained"
//           fullWidth
//           onClick={onRegister}
//           disabled={isLoading}
//           startIcon={isLoading && <CircularProgress size={20} />} //loading spinner
//         >
//           {t("reg_page.btn_reg")}
//         </Button>
//       </Box>
//     </PublicOnlyRoute>
//   );
// };

// export default Registration;
