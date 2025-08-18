import { createTheme } from '@mui/material/styles';

import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

/**
 * Default MUI Theme Configuration
 *
 * Defines the base Material-UI theme for the application.
 * The default theme also applies to the "Easy" difficulty level.
 * 
 * Features:
 * 1. **Color Palette**
 *    - Light mode with black primary text and white background.
 * 
 * 2. **Global CSS Overrides**
 *    - Overrides body background color to match the theme.
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
 * <ThemeProvider theme={defaultTheme}>
 *    <App />
 * </ThemeProvider>
 */
export const defaultTheme = createTheme({
    palette: {
        mode: 'light',
        text:{ primary:'#000000'},
        background: { default: '#ffffff' },       
      },
    components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#ffffff',          
            },
          },
        },
      },
    ...sharedThemeStyles // Merge in shared typography & theme styles
    
});