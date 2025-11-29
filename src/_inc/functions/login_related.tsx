/**
 * ============================================================================
 * LOGIN UTILITIES
 * ============================================================================
 *
 * This file contains helper functions related to user login.
 *
 * 1. validateLogin()
 *    - Performs client-side validation for login form fields
 *    - Checks for:
 *        • missing email
 *        • invalid email format
 *        • missing password
 *    - Returns translation keys for UI error messages, or empty string if valid
 *
 * 2. handleLogin()
 *    - Sends login credentials (email + password) to backend API (Express)
 *    - Processes server response:
 *        • On success → validates user shape via type guard, stores user in Redux,
 *          and redirects to localized homepage
 *        • On failure → maps backend error codes to translated UI messages
 *    - Handles network errors and toggles loading spinner
 *
 * Goal:
 *   - Keep async backend communication isolated from UI components
 *   - Centralize login validation and communication logic for reusability
 *
 * ============================================================================
 */

import { setUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type { My_Type_LoginParams } from "@pexeso/_inc/my_types";
import { isLike_My_Type_User } from "@pexeso/_inc/functions/general";
import { loginPageErrorMap } from "@pexeso/_inc/constants";

/**
 * Validates login form fields before sending to backend.
 *
 * @param form - { email: string, password: string }
 * @returns string - translation key for UI error message, or empty string if valid
 */
export const validateLogin = (form: {
  email: string;
  password: string;
}): string => {
  const { email, password } = form;

  if (!email.trim()) return "login_page.error_alert.missing_credentials";

  // simple email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "reg_page.error_alert.email_format";

  if (!password.trim()) return "login_page.error_alert.missing_credentials";

  return "";
};

/**
 * ============================================================================
 * HANDLE LOGIN FUNCTION
 * ============================================================================
 *
 * Helper function for processing user login.
 * Sends credentials to the backend, handles the response (success/error),
 * updates Redux state, redirects the user, and maps backend errors to
 * frontend translation keys.
 *
 * @param {My_Type_LoginParams} params
 *   - `email`: user email
 *   - `password`: user password
 *   - `lang`: current language for navigation
 *   - `dispatch`: Redux dispatch function
 *   - `setError`: function to set translated error key
 *   - `setIsLoading`: function to toggle loading spinner
 *   - `navigation`: function to redirect user after successful login
 *
 * @returns {Promise<void>} void (side effects only)
 *
 * ============================================================================
 */

export const handleLogin = async ({
  email,
  password,
  lang,
  dispatch,
  setError,
  setIsLoading,
  navigation,
  backendUrl,
}: My_Type_LoginParams & { backendUrl: string }) => {
  // ---------- 1. Start loading state and clear previous errors
  setIsLoading(true);
  setError("");

  //import konštanty
  try {
    // ---------- 2. Send credentials to backend API
    const res = await fetch(
      // `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/login`,
      `${backendUrl}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // important for cookie-based session
      }
    );

    // ---------- 3. Parse JSON response
    const data = await res.json();

    // ---------- 4. Handle unsuccessful response
    if (!res.ok) {
      const translatedKey =
        loginPageErrorMap[data.error] || "login_page.error_alert.unknown_err";
      setError(translatedKey);
      return;
    }

    // ---------- 5. Validate that user object has correct shape
    if (!isLike_My_Type_User(data.user)) {
      setError("reg_page.error_alert.unexpected");
      return;
    }

    // ---------- 6. Store user in Redux
    dispatch(setUser(data.user));

    // ---------- 7. Redirect to localized homepage
    navigation(`/${lang}/`);
  } catch (err) {
    // ---------- 8. Handle unexpected network or runtime errors
    console.error("Login error:", err);
    setError("login_page.error_alert");
  } finally {
    // ---------- 9. Stop loading spinner
    setIsLoading(false);
  }
};
