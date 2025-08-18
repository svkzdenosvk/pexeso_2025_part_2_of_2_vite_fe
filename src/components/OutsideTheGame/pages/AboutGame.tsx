import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';

/**
 * AboutGame Page
 *
 * Displays the "About Game" page of the application.
 *
 * @component
 * @example
 * <AboutGame />
 *
 * @remarks
 * - Uses `useTranslation` hook to fetch i18n text.
 * - Renders a Material UI Box and Typography with translated heading.
 * - Intended to be shown via React Router as an informational page.
 *
 * @dependencies
 * - react-i18next (useTranslation)
 * - @mui/material (Typography, Box)
 */

// ---------- Component

const AboutGame = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mx: 'auto' }}>
      <Typography variant="h2" component="h2">
        {' '}
        {t('about_page.h2')}
      </Typography>
    </Box>
  );
};

export default AboutGame;