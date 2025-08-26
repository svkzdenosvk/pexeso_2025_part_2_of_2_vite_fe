import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import { setUser, clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type { AppDispatch } from "@pexeso/lib/redux/store/store";

/**
 * useAuthState Hook
 *
 * Observes Firebase Authentication state and synchronizes it
 * with the Redux store. Ensures that user profile data exists
 * in Firestore before setting the authenticated user.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Firebase Authentication (`onAuthStateChanged`, `auth`)
 * - Firestore (`getDoc`, `projectUsers`)
 * - Redux (`setUser`, `clearUser`)
 *
 * @example
 * ```tsx
 * // Inside the root App component
 * useAuthState();
 * ```
 *
 * @remarks
 * - On sign in: verifies the user profile exists in Firestore.
 *   - If not found → signs out the user and clears Redux state.
 *   - If found → dispatches `setUser()` with user details.
 * - On sign out: clears Redux state via `clearUser()`.
 * - Automatically unsubscribes from Firebase listener on cleanup.
 */
export const useAuthState = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Subscribe to Firebase Auth state changes (login/logout events)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // CASE 1: User is signed in and has an email
      if (user?.email) {
        try {
          // Create a reference to the user's document in Firestore
          const docRef = doc(projectUsers, "users", user.uid);

          // Fetch the document snapshot from Firestore
          const docSnap = await getDoc(docRef);

          // If the user profile document does not exist in Firestore:
          if (!docSnap.exists()) {
            // 1. Immediately sign the user out (invalid profile)
            await auth.signOut();

            // 2. Clear Redux user state
            dispatch(clearUser());
            return; // stop further execution
          }

          // If profile exists → extract user data
          const data = docSnap.data();

          // Save the user into Redux state with fallback values
          dispatch(
            setUser({
              uid: user.uid,
              name: data?.name ?? "", // default empty string if missing
              email: user.email,
            })
          );
        } catch (err) {
          // Error during checking of profile in Firestore
          console.error("Error during checking of profile in Firestore:", err);

          // Clear Redux user state for safety
          dispatch(clearUser());
        }
      } else {
        // CASE 2: User is signed out (no user or no email)
        dispatch(clearUser());
      }
    });
    
    // Cleanup: unsubscribe from Firebase listener when component unmounts
    return () => unsubscribe();
  }, [dispatch]);
};
