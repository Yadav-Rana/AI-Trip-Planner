import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TripCard from '../components/trips/TripCard';
import { tripAPI } from '../services/api';

const DashboardPage = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripAPI.getTrips();
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load your trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Trips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/trip-planner')}
        >
          Plan New Trip
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : trips.length > 0 ? (
        <Grid container spacing={4}>
          {trips.map((trip) => (
            <Grid item key={trip._id} xs={12} sm={6} md={4}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You don't have any trips yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start planning your next adventure by creating a new trip
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/trip-planner')}
          >
            Plan Your First Trip
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default DashboardPage;
