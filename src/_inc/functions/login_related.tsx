import { setUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type { My_Type_LoginParams } from "@pexeso/_inc/my_types";
import { isLike_My_Type_User } from "@pexeso/_inc/functions/general";
import { loginPageErrorMap } from "@pexeso/_inc/constants";

/**
 * ============================================================================
 * HANDLE LOGIN FUNCTION
 * ============================================================================
 *
 * This file contains the helper function `handleLogin` for logging in users
 * using the backend API (Express + PostgreSQL) in a Vite + React environment.
 *
 * Flow:
 * 1. Sends POST request to `/api/login` with user credentials (email + password)
 * 2. Backend verifies credentials and returns user data if successful
 * 3. Handles backend error codes and maps them to translation keys for UI display
 * 4. On success:
 *    - Validates user object with type guard
 *    - Stores user in Redux
 *    - Redirects to the localized homepage
 * 5. On failure:
 *    - Sets translated error messages
 *    - Handles network or unexpected errors gracefully
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
}: My_Type_LoginParams) => {
  // ---------- 1. Start loading state and clear previous errors
  setIsLoading(true);
  setError("");

  try {
    // ---------- 2. Send credentials to backend API
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/login`,
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
        loginPageErrorMap[data.error] || "reg_page.error_alert.unexpected";
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

