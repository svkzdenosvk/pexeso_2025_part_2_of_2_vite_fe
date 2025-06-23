import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';

// ---------- component

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