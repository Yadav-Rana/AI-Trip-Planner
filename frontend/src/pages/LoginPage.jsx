import { Container, Box, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = ({ setUser }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Sign in to access your trip plans and continue your journey
        </Typography>
        <LoginForm setUser={setUser} />
      </Box>
    </Container>
  );
};

export default LoginPage;
