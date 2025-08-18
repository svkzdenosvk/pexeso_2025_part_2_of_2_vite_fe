import { createTheme } from "@mui/material/styles";

import { sharedThemeStyles } from "@pexeso/components/StylingComp/SharedStyles";

/**
 * Medium MUI Theme Configuration
 *
 * Defines the Material-UI theme for the "Medium" difficulty level.
 *
 * Features:
 * 1. **Color Palette**
 *    - Dark mode with white primary text and custom burgundy-like background (#4d141d).
 *
 * 2. **Global CSS Overrides**
 *    - Body background color set to #4d141d for consistent theme styling.
 *
 * 3. **Shared Theme Styles**
 *    - Typography and other shared styles imported from `SharedStyles`.
 *
 * @dependencies
 * - `@mui/material/styles` → For creating custom Material UI themes.
 * - `SharedStyles` → Centralized typography & UI styles.
 *
 * @example
 * // Apply the theme in a ThemeProvider
 * <ThemeProvider theme={mediumTheme}>
 *    <App />
 * </ThemeProvider>
 */
export const mediumTheme = createTheme({
  palette: {
    mode: "dark",
    text: { primary: "#ffffff" },
    background: { default: "#4d141d" }, // Background color for medium difficulty
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#4d141d", // Body background override
        },
      },
    },
  },
  ...sharedThemeStyles, // Merge in shared typography & theme styles
});
