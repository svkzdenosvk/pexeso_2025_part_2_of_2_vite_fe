// handleLogin.ts
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, projectUsers } from "@pexeso/lib/firebase/firestoreConfigUsers";
import { setUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import type {
  My_Type_LoginParams,
} from "../my_types";

// ============================================================================
// HANDLE LOGIN FUNCTION
// ============================================================================
/**
 * Helper function to log in a user using Firebase Authentication.
 *
 * Responsibilities:
 * - Authenticates user with Firebase (email + password)
 * - Retrieves user profile data from Firestore
 * - Stores user in Redux store
 * - Handles navigation after login
 * - Maps Firebase errors to translation keys for UI display
 *
 * Notes:
 * - Keeps UI layer (Login component) clean by separating async logic
 * - Expects `My_Type_Lang` for language-safe navigation
 */

/**
 * Handles user login with Firebase Authentication.
 *
 * @param {Object} params
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {My_Type_Lang} params.lang - Current language for navigation
 * @param {AppDispatch} params.dispatch - Redux dispatcher
 * @param {(path: string) => void} params.navigate - Navigation function
 * @param {(error: string) => void} params.setError - Sets translated error key
 * @param {(loading: boolean) => void} params.setIsLoading - Toggles loading spinner
 */
export const handleLogin = async ({
  email,
  password,
  lang,
  dispatch,
  navigate,
  setError,
  setIsLoading
}: My_Type_LoginParams) => {
  setIsLoading(true);  // start loading spinner
  setError(""); // clear previous errors

  try {

    // 1. Firebase authentication
    const res = await signInWithEmailAndPassword(auth, email, password);

    // 2. Fetch user profile from Firestore
    const docSnap = await getDoc(doc(projectUsers, "users", res.user.uid));
    const data = docSnap.data();

    // 3. Store user in Redux
    dispatch(
      setUser({
        uid: res.user.uid,
        name: data?.name ?? "",
        email: res.user.email ?? "",
      })
    );

    // 4. Navigate to localized homepage
    navigate(`/${lang}/`);
  } catch (e) {
    const err = e as FirebaseError;

    // 5. Map Firebase error codes to translation keys
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/invalid-credentials":
        setError("login_page.error_alert.invalid_credentials");
        break;
      case "auth/too-many-requests":
        setError("login_page.error_alert.too_many_req");
        break;
      case "auth/network-request-failed":
        setError("login_page.error_alert.net_req_failed");
        break;
      default:
        setError("login_page.error_alert.unknow_err");
    }
  } finally {
    setIsLoading(false); // stop loading spinner
  }
};