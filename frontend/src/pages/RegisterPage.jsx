import { Container, Box, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = ({ setUser }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Join us to start planning your perfect trips with personalized recommendations
        </Typography>
        <RegisterForm setUser={setUser} />
      </Box>
    </Container>
  );
};

export default RegisterPage;
