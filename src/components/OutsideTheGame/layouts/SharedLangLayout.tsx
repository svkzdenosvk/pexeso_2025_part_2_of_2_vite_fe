import { Outlet } from "react-router-dom";
import LanguageInit from "../LanguageInit";
import { Box } from "@mui/material";

import ButtonLogReg from "@pexeso/components/LogReg/ButtonLogReg";

/**
 * SharedLangLayout Component
 *
 * Layout wrapper for pages that use a language prefix in their URL.
 * Ensures language initialization and provides common UI elements
 * for these routes.
 *
 * Features:
 * - Initializes language settings on mount.
 * - Displays login/register button in a shared location.
 * - Renders nested routes via React Router's <Outlet />.
 *
 * @component
 * @dependencies
 * - react-router-dom (Outlet)
 * - Internal component: LanguageInit (handles language setup)
 * - Internal component: ButtonLogReg (login/register button)
 *
 * @example
 * <Route path="/:lang" element={<SharedLangLayout />}>
 *   <Route path="about" element={<AboutPage />} />
 * </Route>
 */
const sharedLangWrapperStyles = {
  p: 0,
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
} as const;

const logRegBtnsWrapperStyles = {
  m: 1,
  mb: 2,
} as const;

const SharedLangLayout = () => {
  return (
    <Box sx={sharedLangWrapperStyles}>
      <Box sx={logRegBtnsWrapperStyles}>
        {/* Initializes language settings*/}
        <LanguageInit />

        {/* Login/Register button shown on all language-prefixed pages */}
        <ButtonLogReg />
      </Box>
      {/* Nested routes will be rendered here */}
      <Outlet />
    </Box>
  );
};

export default SharedLangLayout;
