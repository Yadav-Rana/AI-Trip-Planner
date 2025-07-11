import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';

const OnboardingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user has already completed onboarding, redirect to dashboard
    if (user && user.preferences && user.preferences.onboardingCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <OnboardingWizard user={user} setUser={setUser} />
    </Box>
  );
};

export default OnboardingPage;
