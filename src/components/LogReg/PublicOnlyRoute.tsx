import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";

/**
 * PublicOnlyRoute Component
 *
 * Restricts access to routes intended only for unauthenticated (public) users.
 *
 * Responsibilities:
 * - Checks if a user is logged in (via Redux state)
 * - Redirects authenticated users to their language-prefixed homepage
 * - Renders child components only if the user is not logged in
 *
 * Notes:
 * - Designed to wrap routes like login or register pages
 * - Uses `useNavigate` for programmatic redirection
 * - Returns `null` when redirecting (could be replaced with a loading spinner)
 *
 * @component
 * @dependencies
 * - react-router-dom (useNavigate, useParams)
 * - react-redux (useSelector)
 * - Redux store type (RootState)
 *
 * @example
 * <PublicOnlyRoute>
 *   <LoginPage />
 * </PublicOnlyRoute>
 */

// ---------- component

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  // Current authenticated user from Redux store (null if not logged in)
  const user = useSelector((state: RootState) => state.auth.user);

  // Hook for navigation (programmatic redirects)
  const navigate = useNavigate();

  // Current language parameter from the route
  const { lang } = useParams();

  // Redirect authenticated users to the home page for their language
  useEffect(() => {
    if (user) {
      navigate(`/${lang}/`);
    }
  }, [user, navigate, lang]);

  // If user exists, prevent rendering children (route is not public anymore)
  // Returning `null` avoids flicker — could be replaced with a spinner if needed
  if (user) return null;

  // Otherwise, render the wrapped public route content
  return <>{children}</>;
};

export default PublicOnlyRoute;
