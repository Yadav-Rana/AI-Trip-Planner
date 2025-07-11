import { Container, Typography, Box } from '@mui/material';
import TripForm from '../components/trips/TripForm';

const TripPlannerPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plan Your Trip
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Fill in your preferences and let our AI create a personalized itinerary for you
        </Typography>
      </Box>
      
      <TripForm />
    </Container>
  );
};

export default TripPlannerPage;
