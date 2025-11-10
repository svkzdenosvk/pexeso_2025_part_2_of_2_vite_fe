import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type { AppDispatch } from "@pexeso/lib/redux/store/store";
import { isLike_My_Type_User } from "@pexeso/_inc/functions/general";

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

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // ---------- 1. Validate current session with backend API (GET /api/me)
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/me`,
          {
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

        console.log("data", res.status);

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
  }, [dispatch]);
};

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
// import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
// import type { AppDispatch } from "@pexeso/lib/redux/store/store";

// /**
//  * useAuthState Hook
//  *
//  * Observes Firebase Authentication state and synchronizes it
//  * with the Redux store. Ensures that user profile data exists
//  * in Firestore before setting the authenticated user.
//  *
//  * @hook
//  * @returns void (side effects only)
//  *
//  * @dependencies
//  * - Firebase Authentication (`onAuthStateChanged`, `auth`)
//  * - Firestore (`getDoc`, `projectUsers`)
//  * - Redux (`setUser`, `clearUser`)
//  *
//  * @example
//  * ```tsx
//  * // Inside the root App component
//  * useAuthState();
//  * ```
//  *
//  * @remarks
//  * - On sign in: verifies the user profile exists in Firestore.
//  *   - If not found → signs out the user and clears Redux state.
//  *   - If found → dispatches `setUser()` with user details.
//  * - On sign out: clears Redux state via `clearUser()`.
//  * - Automatically unsubscribes from Firebase listener on cleanup.
//  */
// export const useAuthState = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     // Subscribe to Firebase Auth state changes (login/logout events)
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       // CASE 1: User is signed in and has an email
//       if (user?.email) {
//         try {
//           // Create a reference to the user's document in Firestore
//           const docRef = doc(projectUsers, "users", user.uid);

//           // Fetch the document snapshot from Firestore
//           const docSnap = await getDoc(docRef);

//           // If the user profile document does not exist in Firestore:
//           if (!docSnap.exists()) {
//             // 1. Immediately sign the user out (invalid profile)
//             await auth.signOut();

//             // 2. Clear Redux user state
//             dispatch(clearUser());
//             return; // stop further execution
//           }

//           // If profile exists → extract user data
//           const data = docSnap.data();

//           // Save the user into Redux state with fallback values
//           dispatch(
//             setUser({
//               uid: user.uid,
//               name: data?.name ?? "", // default empty string if missing
//               email: user.email,
//             })
//           );
//         } catch (err) {
//           // Error during checking of profile in Firestore
//           console.error("Error during checking of profile in Firestore:", err);

//           // Clear Redux user state for safety
//           dispatch(clearUser());
//         }
//       } else {
//         // CASE 2: User is signed out (no user or no email)
//         dispatch(clearUser());
//       }
//     });

//     // Cleanup: unsubscribe from Firebase listener when component unmounts
//     return () => unsubscribe();
//   }, [dispatch]);
// };
