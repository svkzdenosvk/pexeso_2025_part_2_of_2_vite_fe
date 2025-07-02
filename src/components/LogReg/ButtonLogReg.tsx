import { Box, Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { clearUser } from "@pexeso/lib/redux/store/reducers/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@pexeso/lib/firebase/firestoreConfigUsers";

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

// ---------- component

export const ButtonLogReg = () => {
  const { lang } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
  };

  return (
    <Box sx={styles.wrapper}>
      <Typography variant="body1">
        {/* {user?.name ? `Prihlásený: ${user.name}` : "Hosť"} */}
        {user?.name && user.name}	
      </Typography>

      {!user?.uid ? (
        <>
          <Button
            component={Link}
            to={`/${lang}/registration`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.reg")}
          </Button>
          <Button
            component={Link}
            to={`/${lang}/login`}
            variant="contained"
            sx={styles.linkButton}
          >
            {t("reg_log_btn.log")}
          </Button>
        </>
      ) : (
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
