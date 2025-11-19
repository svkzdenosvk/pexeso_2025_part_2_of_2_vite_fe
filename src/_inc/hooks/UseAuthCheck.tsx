import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type { AppDispatch } from "@pexeso/lib/redux/store/store";
import { isLike_My_Type_User } from "@pexeso/_inc/functions/general";
import { selectBackendUrl } from "@pexeso/lib/redux/store/reducers/backendSlice";

/**
 * useAuthCheck Hook
 *
 * Purpose:
 * - Validates user authentication status on app initialization or route change.
 * - Communicates with the backend API to verify or refresh session (via cookies / JWT).
 * - Keeps the Redux store synchronized with the actual authentication state.
 *
 * Workflow:
 * 1. Fetch Express `/api/me` to validate or refresh the user's session using cookies.
 * 2. If valid, dispatch `setUser()` with user data.
 * 3. If invalid, expired, or network error occurs → dispatch `clearUser()`.
 * 4. Runs automatically on first render and whenever the Redux dispatch reference changes.
 *
 * @dependencies
 * - React: useEffect
 * - Redux: useDispatch, setUser, clearUser
 * - Backend API: `/api/me`
 * - Type guard: isLike_My_Type_User
 */
export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  //dynamic be URL from Redux
  const backendUrl = useSelector(selectBackendUrl);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // ---------- 1. Validate current session with backend API (GET /api/me)
        const res = await fetch(
          // `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/me`,
          `${backendUrl}/me`, {

            method: "GET",
            credentials: "include", // Send cookies with request
          }
        );

        // ---------- 2. Handle invalid or expired session
        if (!res.ok) {
          dispatch(clearUser());
          return;
        }

        const data = await res.json();

        // console.log("data", res.status);

        // Validate that the API response matches expected user type
        if (!isLike_My_Type_User(data.user)) {
          dispatch(clearUser());
          return;
        }
        
        // ---------- 3. If backend confirms active session, update Redux store
        if (data?.isLoggedIn) {
          dispatch(setUser(data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        // ---------- 4. Handle unexpected errors (network or runtime)
        console.error("Auth check error:", err);
        dispatch(clearUser());
      }
    };

    checkLogin();
  }, [dispatch, backendUrl]);
};

