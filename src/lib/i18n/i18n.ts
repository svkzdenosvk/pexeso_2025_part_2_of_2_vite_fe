import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import sk from './locales/sk/translation.json';
import de from './locales/de/translation.json';

/**
 * i18n Initialization
 *
 * Sets up internationalization (i18n) for the application using `i18next` and `react-i18next`.
 * This configuration loads translations for multiple languages and defines fallback behavior.
 *
 * **Features:**
 * 1. **Languages** — English (`en`), Slovak (`sk`), German (`de`).
 * 2. **Fallback** — Defaults to English if the selected language is missing a translation.
 * 3. **Interpolation** — Disables React's automatic escaping, as React already handles XSS prevention.
 * 4. **Suspense Option** — `useSuspense` is currently commented out; can be enabled to control lazy loading behavior.
 *
 * @dependencies
 * - i18next
 * - react-i18next
 *
 * @example
 * // Change language at runtime
 * i18n.changeLanguage('sk');
 */

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sk: { translation: sk },
    de: { translation: de },
  },
  // lng: 'sk', // Default language (uncomment to set Slovak as default)
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values

  },
//   react: {
//   useSuspense: false  // Uncomment to disable suspense in translation loading
// }
});

export default i18n;