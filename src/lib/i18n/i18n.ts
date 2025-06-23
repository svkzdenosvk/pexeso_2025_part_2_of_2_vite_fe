import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import sk from './locales/sk/translation.json';
import de from './locales/de/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sk: { translation: sk },
    de: { translation: de },
  },
  // lng: 'sk', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react doing this automatically
  },
//   react: {
//   useSuspense: false
// }
});

export default i18n;