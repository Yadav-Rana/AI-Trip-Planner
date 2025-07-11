import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Slider
} from '@mui/material';
import { tripAPI, geminiAPI } from '../../services/api';

const TRAVEL_STYLES = [
  'adventure',
  'relaxation',
  'cultural',
  'foodie',
  'budget',
  'luxury'
];

const TRANSPORTATION_OPTIONS = [
  'walking',
  'public transport',
  'taxi',
  'rental car',
  'bicycle',
  'tour bus'
];

const INTERESTS = [
  'museums',
  'history',
  'nature',
  'shopping',
  'nightlife',
  'beaches',
  'mountains',
  'food',
  'architecture',
  'art',
  'local experiences',
  'photography'
];

const ACCOMMODATION_TYPES = [
  'hotel',
  'hostel',
  'apartment',
  'resort',
  'guesthouse',
  'camping'
];

const TripForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: {
      total: 1000,
      currency: 'USD'
    },
    preferences: {
      travelStyle: 'adventure',
      transportation: ['walking', 'public transport'],
      interests: ['museums', 'food'],
      accommodationType: 'hotel'
    }
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: value
      }
    });
  };

  const handleBudgetChange = (event, newValue) => {
    setFormData({
      ...formData,
      budget: {
        ...formData.budget,
        total: newValue
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Calculate trip duration
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      if (duration < 1) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }

      // First create the trip in the database
      const tripResponse = await tripAPI.createTrip(formData);
      const tripId = tripResponse.data._id;

      // Then get AI recommendations
      const recommendationsResponse = await geminiAPI.getTripRecommendations({
        destination: formData.destination,
        duration,
        budget: formData.budget,
        travelStyle: formData.preferences.travelStyle,
        transportation: formData.preferences.transportation,
        interests: formData.preferences.interests,
        accommodationType: formData.preferences.accommodationType
      });

      // Update the trip with the AI recommendations
      if (recommendationsResponse.data) {
        await tripAPI.updateTrip(tripId, {
          itinerary: recommendationsResponse.data.itinerary,
          summary: recommendationsResponse.data.summary
        });
      }

      // Navigate to the trip details page
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      setError(
        error.response?.data?.message || 
        'Failed to create trip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Plan Your Trip
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="destination"
              label="Destination"
              name="destination"
              placeholder="e.g. Paris, France"
              value={formData.destination}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="startDate"
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="endDate"
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Budget: ${formData.budget.total}
            </Typography>
            <Slider
              value={formData.budget.total}
              onChange={handleBudgetChange}
              aria-labelledby="budget-slider"
              min={1000}
              max={100000}
              step={200}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="travel-style-label">Travel Style</InputLabel>
              <Select
                labelId="travel-style-label"
                id="preferences.travelStyle"
                name="preferences.travelStyle"
                value={formData.preferences.travelStyle}
                onChange={handleChange}
                label="Travel Style"
              >
                {TRAVEL_STYLES.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="accommodation-type-label">Accommodation Type</InputLabel>
              <Select
                labelId="accommodation-type-label"
                id="preferences.accommodationType"
                name="preferences.accommodationType"
                value={formData.preferences.accommodationType}
                onChange={handleChange}
                label="Accommodation Type"
              >
                {ACCOMMODATION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="transportation-label">Transportation Preferences</InputLabel>
              <Select
                labelId="transportation-label"
                id="preferences.transportation"
                name="preferences.transportation"
                multiple
                value={formData.preferences.transportation}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput id="select-transportation" label="Transportation Preferences" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {TRANSPORTATION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="interests-label">Interests</InputLabel>
              <Select
                labelId="interests-label"
                id="preferences.interests"
                name="preferences.interests"
                multiple
                value={formData.preferences.interests}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput id="select-interests" label="Interests" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {INTERESTS.map((interest) => (
                  <MenuItem key={interest} value={interest}>
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Generating Trip Plan...
            </>
          ) : (
            'Create Trip Plan'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default TripForm;
