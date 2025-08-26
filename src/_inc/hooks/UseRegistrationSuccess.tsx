// hooks/useRegistrationSuccess.ts
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * useRegistrationSuccess Hook
 *
 * Detects if user has just completed registration (via `location.state.fromRegister`)
 * and provides a flag to show a one-time success message.
 *
 * @hook
 * @returns {boolean} showSuccess – whether the success state should be displayed
 *
 * @dependencies
 * - react-router-dom (`useLocation`, `useNavigate`)
 *
 * @example
 * ```tsx
 * const showSuccess = useRegistrationSuccess();
 * return showSuccess && <SuccessBanner />;
 * ```
 *
 * @remarks
 * - Resets the `location.state` after detecting registration success
 *   to avoid showing the message on page refresh or back navigation.
 * - Navigation is replaced in history (no extra entry).
 */
export const useRegistrationSuccess = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if navigation came from registration page
    if (location.state?.fromRegister) {
      setShowSuccess(true);

      // Reset state in URL history (avoid repeat on refresh)
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return showSuccess;
};
