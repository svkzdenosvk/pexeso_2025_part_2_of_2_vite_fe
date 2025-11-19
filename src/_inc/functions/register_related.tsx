/**
 * ============================================================================
 * REGISTRATION UTILITIES
 * ============================================================================
 *
 * This file contains helper functions related to user registration.
 *
 * 1. handleRegister()
 *    - Sends registration data to the backend API (Express + PostgreSQL + Prisma)
 *    - Handles server response: success → reset form & redirect to login
 *    - Maps backend errors to translated UI messages
 *    - Handles network errors and toggles loading state
 *
 * 2. validateRegistration()
 *    - Validates registration form fields on the client before submission
 *    - Checks name length, email format, password strength, and password confirmation
 *    - Returns translation keys for UI error messages, or empty string if valid
 *
 * Goal:
 *   - Keep async backend communication separate from UI components
 *   - Centralize form validation and registration logic for reusability
 *
 * ============================================================================
 */

import type {
  My_Type_RegistrationForm,
  My_Type_RegisterParams,
} from "@pexeso/_inc/my_types";

import { registerPageErrorMap } from "@pexeso/_inc/constants";

/**
 * Validates registration form fields before sending data to the API.
 *
 * Checks for:
 * - Name length (3–50 chars)
 * - Valid email format
 * - Password strength (length, uppercase, number, special character)
 * - Password and confirmation match
 *
 * @param {My_Type_RegistrationForm} form - Registration form values
 * @returns {string} Translation key for UI error message, or empty string if valid
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
  if (!/[!@#$%^&*-]/.test(password)) return "reg_page.error_alert.pass_special";
  if (password !== confirm) return "reg_page.error_alert.pass_confirm";

  return "";
};

/**
 * Handles registration request for the Express backend (PostgreSQL + Prisma).
 *
 * Workflow:
 * 1. Sends a POST request to `/registration` with form data (name, email, password, lang)
 * 2. Waits for backend response:
 *    - On success → resets form and redirects to login page with success flag
 *    - On failure → maps backend error code to a translated UI message
 * 3. Handles network errors and toggles loading state
 *
 * @param {My_Type_RegisterParams & { navigate: (path: string) => void }} params
 *   - `form`: registration form values
 *   - `lang`: current language
 *   - `setError`: function to set translated error message key
 *   - `setIsLoading`: function to toggle loading spinner
 *   - `resetForm`: function to clear inputs on success
 *   - `navigate`: function to redirect to another route
 *
 * @returns {Promise<void>} void (side effects only)
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
    const res = await fetch(
      // `${import.meta.env.VITE_API_URL}/registration`, 
      `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/registration`,
      {
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

    // Success: reset form and redirect to login page with success flag
    resetForm();
    navigate(`/${lang}/login`, { state: { fromRegister: true } });
  } catch (err) {
    console.error("Registration error:", err);
    setError("reg_page.error_alert.network_error");
  } finally {
    setIsLoading(false);
  }
};
