import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  LinearProgress
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  // Format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Calculate budget percentage used
  const budgetPercentage = trip.budget.total > 0 
    ? (trip.budget.spent / trip.budget.total) * 100 
    : 0;
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {trip.destination}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({duration} days)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Budget: ${trip.budget.total} (${trip.budget.spent} spent)
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Budget Usage:
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(budgetPercentage, 100)} 
            color={budgetPercentage > 90 ? "error" : "primary"}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item>
            <Chip 
              size="small" 
              label={trip.status} 
              color={
                trip.status === 'completed' ? 'success' : 
                trip.status === 'in-progress' ? 'info' : 
                trip.status === 'planning' ? 'primary' : 
                'default'
              }
            />
          </Grid>
          {trip.preferences?.travelStyle && (
            <Grid item>
              <Chip 
                size="small" 
                label={trip.preferences.travelStyle} 
                variant="outlined" 
              />
            </Grid>
          )}
        </Grid>
        
        {trip.summary?.highlights && trip.summary.highlights.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Highlights:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {trip.summary.highlights.slice(0, 2).join(', ')}
              {trip.summary.highlights.length > 2 && '...'}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<FlightTakeoffIcon />}
          onClick={() => navigate(`/trips/${trip._id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;
