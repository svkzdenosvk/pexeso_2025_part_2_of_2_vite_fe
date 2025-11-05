import { Box, Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";

/**
 * ButtonLogReg Component (Vite + Express + PostgreSQL)
 *
 * - Shows Register & Login buttons for guests
 * - Shows Logout button for logged-in users
 * - Logs out via Express API `/api/logout` (clears JWT cookies)
 * - Syncs with Redux (clears user state)
 */

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
    p: 2,
  },
  linkButton: {
    textTransform: "none",
    fontSize: "1rem",
    px: 2,
    py: 1,
  },
};

export const ButtonLogReg = () => {
  const { lang } = useParams(); // e.g. /en/, /sk/
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user } = useSelector((state: RootState) => state.auth);

  // ---------- Function: Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include", // Send cookies
      });

      if (!res.ok) throw new Error("Logout failed");

      // ✅ Backend cleared cookies, now clear Redux state
      dispatch(clearUser());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Box sx={styles.wrapper}>
      {/* Display username if logged in */}
      <Typography variant="body1">{user?.name}</Typography>

      {/* Not logged in → show Register + Login */}
      {!user?.id ? (
        <>
          <Button
            component={Link}
            to={`/${lang || "en"}/registration`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.reg")}
          </Button>
          <Button
            component={Link}
            to={`/${lang || "en"}/login`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.log")}
          </Button>
        </>
      ) : (
        // Logged in → show Logout
        <Button
          variant="contained"
          sx={styles.linkButton}
          onClick={handleLogout}
        >
          {t("reg_log_btn.log_out")}
        </Button>
      )}
    </Box>
  );
};

export default ButtonLogReg;


// import { Box, Button, Typography } from "@mui/material";
// import { Link, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@pexeso/lib/redux/store/store";
// import { clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
// import { signOut } from "firebase/auth";
// import { auth } from "@pexeso/lib/firebase/firestoreConfigUsers";

// /**
//  * ButtonLogReg Component
//  *
//  * Renders login/registration buttons for guests
//  * or a logout button for authenticated users.
//  *
//  * Responsibilities:
//  * - Display logged-in user's name (if available)
//  * - Provide navigation to login & registration pages
//  * - Handle Firebase sign-out and clear Redux user state
//  *
//  * Notes:
//  * - Language is derived from route params
//  * - Uses translation keys for button labels
//  *
//  * @component
//  * @dependencies
//  * - React Router: useParams, Link
//  * - State & i18n: react-redux, react-i18next
//  * - UI components: @mui/material
//  * - Firebase: firebase/auth
//  * - Redux slice: clearUser
//  *
//  * @example
//  * <ButtonLogReg />
//  */

// // ---------- Sx styles

// const styles = {
//   wrapper: {
//     display: "flex",
//     width: "100%",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     gap: 2,
//     p: 2,
//   },
//   linkButton: {
//     textTransform: "none",
//     fontSize: "1rem",
//     px: 2,
//     py: 1,
//   },
// };

// // ---------- Component

// export const ButtonLogReg = () => {
//   const { lang } = useParams(); // get current language from URL
//   const dispatch = useDispatch();
//   const { t } = useTranslation();

//   const { user } = useSelector((state: RootState) => state.auth); // get user from Redux

//   // ---------- Function: Logout handler
//   const handleLogout = async () => {
//     await signOut(auth); // Firebase sign out
//     dispatch(clearUser()); // clear user in Redux
//   };

//   return (
//     <Box sx={styles.wrapper}>
//       <Typography variant="body1">
//         {/* Show username if logged in */}
//         {user?.name && user.name}
//       </Typography>

//       {/* If user is not logged in -> show Register + Login buttons */}
//       {!user?.uid ? (
//         <>
//           <Button
//             component={Link}
//             to={`/${lang}/registration`}
//             variant="contained"
//             sx={styles.linkButton}
//           >
//             {t("reg_log_btn.reg")}
//           </Button>
//           <Button
//             component={Link}
//             to={`/${lang}/login`}
//             variant="contained"
//             sx={styles.linkButton}
//           >
//             {t("reg_log_btn.log")}
//           </Button>
//         </>
//       ) : (
        
//         // If logged in -> show Logout button
//         <Button
//           variant="contained"
//           sx={styles.linkButton}
//           onClick={handleLogout}
//         >
//           {t("reg_log_btn.log_out")}
//         </Button>
//       )}
//     </Box>
//   );
// };

// export default ButtonLogReg;
