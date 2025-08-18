import { createTheme } from '@mui/material/styles';

import {sharedThemeStyles} from '@pexeso/components/StylingComp/SharedStyles'

/**
 * Hard MUI Theme Configuration
 *
 * Defines the Material-UI theme for the "Hard" difficulty level.
 *
 * Features:
 * 1. **Color Palette**
 *    - Dark mode with white primary text and black background.
 *
 * 2. **Global CSS Overrides**
 *    - Body background color set to black for immersive dark theme.
 *    - `.clorTextTheme` class → Forces white text color with `!important`.
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
 * <ThemeProvider theme={hardTheme}>
 *    <App />
 * </ThemeProvider>
 */
export const hardTheme = createTheme({
    palette: {
        mode: 'dark',
        text:{ primary:'#ffffff'},
        background: { default: 'black' },       
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: 'black',          
            },
            '.clorTextTheme':{
              color: 'white !important',   
            },
          },
        },
      },
    ...sharedThemeStyles // Merge in shared typography & theme styles
    
});