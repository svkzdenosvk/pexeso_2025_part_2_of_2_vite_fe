import type {
  My_Type_RegistrationForm,
  My_Type_RegisterParams,
} from "@pexeso/_inc/my_types";

import { registerPageErrorMap } from "@pexeso/_inc/constants";

/**
 * Validates registration form fields before sending data to the API.
 */
export const validateRegistration = (
  form: My_Type_RegistrationForm
): string => {
  const { password, confirm, name, email } = form;

  if (name.length < 3) return "reg_page.error_alert.name_length_min";
  if (name.length > 50) return "reg_page.error_alert.name_length_max";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "reg_page.error_alert.email_format";

  if (password.length < 6 || password.length > 20)
    return "reg_page.error_alert.pass_length";
  if (!/[A-Z]/.test(password)) return "reg_page.error_alert.pass_upper";
  if (!/[0-9]/.test(password)) return "reg_page.error_alert.pass_number";
  if (!/[!@#$%^&*-]/.test(password))
    return "reg_page.error_alert.pass_special";
  if (password !== confirm) return "reg_page.error_alert.pass_confirm";

  return "";
};

/**
 * Handles registration request for Express backend (PostgreSQL).
 */
export const handleRegister = async ({
  form,
  lang,
  setError,
  setIsLoading,
  resetForm,
  navigate,
}: My_Type_RegisterParams & { navigate: (path: string) => void }) => {
  setIsLoading(true);
  setError("");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        lang,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const key =
        registerPageErrorMap[data.error] || "reg_page.error_alert.unexpected";
      setError(key);
      return;
    }

    // success
    resetForm();
    navigate(`/${lang}/login?fromRegister=true`);
  } catch (err) {
    console.error("Registration error:", err);
    setError("reg_page.error_alert.network_error");
  } finally {
    setIsLoading(false);
  }
};


// /**
//  * ============================================================================
//  * REGISTRATION UTILITIES
//  * ============================================================================
//  *
//  * This file contains helper functions related to user registration.
//  *
//  * 1. handleRegister()
//  *    - Creates new user in Firebase Authentication
//  *    - Stores user profile in Firestore
//  *    - Handles cleanup if Firestore save fails
//  *    - Redirects user to login page with success flag
//  *
//  * 2. validateRegistration()
//  *    - Validates registration form fields before submission
//  *    - Returns translation keys for UI error messages
//  *
//  * Goal:
//  *   - Keep async Firebase logic outside UI components
//  *   - Centralize form validation for reusability
//  *
//  * ============================================================================
//  */

// import { FirebaseError } from "firebase/app";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import {
//   signOut,
//   fetchSignInMethodsForEmail,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
// import type {
//   My_Type_RegistrationForm, My_Type_RegisterParams
// } from "../my_types";

// /**
//  * Handles new user registration with Firebase Authentication & Firestore.
//  *
//  * Flow:
//  * 1. Check if email is already registered
//  * 2. Create user in Firebase Auth
//  * 3. Save profile in Firestore
//  * 4. On success → sign out and redirect to login (with success flag)
//  * 5. On Firestore error → rollback by deleting user from Auth
//  *
//  * @param {Object} params
//  * @param {My_Type_RegistrationForm} params.form - Registration form values
//  * @param {My_Type_Lang} params.lang - Current language for navigation
//  * @param {(path: string, options?: any) => void} params.navigate - Navigation function
//  * @param {(error: string) => void} params.setError - Sets translated error key
//  * @param {(loading: boolean) => void} params.setIsLoading - Toggles loading spinner
//  * @param {() => void} params.resetForm - Clears form fields after successful registration
//  */
// export const handleRegister = async ({
//   form,
//   lang,
//   navigate,
//   setError,
//   setIsLoading,
//   resetForm
// }: My_Type_RegisterParams) => {
//   setIsLoading(true);
//   setError("");

//   try {
//     // 1. Check if email already exists
//     const methods = await fetchSignInMethodsForEmail(auth, form.email);
//     if (methods.length > 0) {
//       setError("reg_page.error_alert.email_registered");
//       setIsLoading(false);
//       return;
//     }

//     // 2. Create user in Firebase Auth
//     const res = await createUserWithEmailAndPassword(
//       auth,
//       form.email,
//       form.password
//     );
//     const newUser = res.user;

//     try {
//       // 3. Save user profile in Firestore
//       await setDoc(doc(projectUsers, "users", newUser.uid), {
//         name: form.name,
//         email: form.email,
//         createdAt: serverTimestamp(),
//       });

//       // 4. Sign out and redirect to login with success message
//       await signOut(auth);
//       setError("");
//       resetForm();
//       navigate(`/${lang}/login`, { state: { fromRegister: true } });
//     } catch (firestoreError) {
//       console.error("User not saved in Firestore:", firestoreError);

//       // 5. On Firestore error → rollback by deleting user from Auth
//       try {
//         await newUser.delete();
//         console.log("User successfully deleted from Auth after Firebase error");
//       } catch (deleteError) {
//         console.error("Deleting user from Auth failed:", deleteError);
//       }

//       setError("reg_page.error_alert.reg_failed");
//     }
//   } catch (e) {
//     const err = e as FirebaseError;
//     console.error("Firebase Error:", err.code, err.message);
    
//     if (err.code === "auth/email-already-in-use") {
//       setError("reg_page.error_alert.email_registered");
//     } else {
//       setError("reg_page.error_alert.unexpected");
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };

// // ============================================================================
// // VALIDATION
// // ============================================================================

// /**
//  * Validates registration form fields before sending data to Firebase.
//  *
//  * Rules:
//  * - Name: min 3, max 50 chars
//  * - Email: must match simple regex pattern
//  * - Password: 6–20 chars, at least one uppercase, at least one special char
//  * - Confirm: must match password
//  *
//  * @param {My_Type_RegistrationForm} form - Registration form values
//  * @returns {string} translation key of validation error, or empty string if valid
//  */
// export const validateRegistration = (form: My_Type_RegistrationForm): string => {
//   const { password, confirm, name, email } = form;
  
//   if (name.length < 3) return "reg_page.error_alert.name_length_min";
//   if (name.length > 50) return "reg_page.error_alert.name_length_max";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//     return "reg_page.error_alert.email_format";
//   if (password.length < 6 || password.length > 20)
//     return "reg_page.error_alert.pass_length";
//   if (!/[A-Z]/.test(password)) return "reg_page.error_alert.pass_upper";
//   if (!/[!@#$%^&*-]/.test(password))
//     return "reg_page.error_alert.pass_special";
//   if (password !== confirm) return "reg_page.error_alert.pass_confirm";
  
//   return "";
// };