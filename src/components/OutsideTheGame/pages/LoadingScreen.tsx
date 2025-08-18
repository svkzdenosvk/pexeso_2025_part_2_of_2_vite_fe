// ./components/LoadingScreen.tsx
import { Box, CircularProgress } from "@mui/material";

/**
 * LoadingScreen Component
 *
 * Displays a full-page loading indicator with a centered spinner.
 * Used during async operations (e.g., fetching data, authentication).
 *
 * @component
 * @example
 * <LoadingScreen />
 *
 * @dependencies
 * - @mui/material (Box, CircularProgress)
 */

// ---------- Component

const LoadingScreen = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingScreen;
