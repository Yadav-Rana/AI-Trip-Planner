import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TripItinerary from "../components/trips/TripItinerary";
import EnhancedTripItinerary from "../components/trips/EnhancedTripItinerary";
import {tripAPI, geminiAPI} from "../services/api";

const TripDetailsPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optimizingBudget, setOptimizingBudget] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await tripAPI.getTripById(id);
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip:", error);
        setError("Failed to load trip details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleDeleteTrip = async () => {
    try {
      await tripAPI.deleteTrip(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting trip:", error);
      setError("Failed to delete trip. Please try again later.");
    }
    setDeleteDialogOpen(false);
  };

  const handleOptimizeBudget = async () => {
    if (!trip) return;

    setOptimizingBudget(true);
    try {
      // Ask for a budget that's 20% less than the current total
      const targetBudget = Math.floor(trip.summary.totalCost * 0.8);

      const response = await geminiAPI.optimizeBudget(trip, targetBudget);

      if (response.data) {
        // Update the trip with optimized plan
        await tripAPI.updateTrip(id, {
          itinerary: response.data.itinerary,
          summary: response.data.summary,
        });

        // Refresh trip data
        const updatedTrip = await tripAPI.getTripById(id);
        setTrip(updatedTrip.data);
      }
    } catch (error) {
      console.error("Error optimizing budget:", error);
      setError("Failed to optimize budget. Please try again later.");
    } finally {
      setOptimizingBudget(false);
    }
  };

  // Format dates
  const formatDate = (dateString) => {
    const options = {year: "numeric", month: "long", day: "numeric"};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{mt: 4, mb: 8}}>
        <Box sx={{display: "flex", justifyContent: "center", my: 4}}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{mt: 4, mb: 8}}>
        <Alert severity="error" sx={{mb: 4}}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="lg" sx={{mt: 4, mb: 8}}>
        <Alert severity="warning" sx={{mb: 4}}>
          Trip not found
        </Alert>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Calculate budget percentage used
  const budgetPercentage =
    trip.budget.total > 0 ? (trip.budget.spent / trip.budget.total) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 8}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {trip.destination}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{mr: 2}}
            onClick={() => navigate(`/trips/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{p: 3, mb: 4}}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
              <CalendarTodayIcon sx={{mr: 1}} />
              <Typography variant="body1">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)} (
                {duration} days)
              </Typography>
            </Box>

            <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
              <AttachMoneyIcon sx={{mr: 1}} />
              <Typography variant="body1">
                Budget: ${trip.budget.total}
              </Typography>
            </Box>

            <Box sx={{mb: 2}}>
              <Typography variant="body2" gutterBottom>
                Budget Usage: ${trip.budget.spent} of ${trip.budget.total} ($
                {trip.budget.remaining} remaining)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(budgetPercentage, 100)}
                color={budgetPercentage > 90 ? "error" : "primary"}
                sx={{height: 10, borderRadius: 5}}
              />
            </Box>

            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 2}}>
              <Chip
                label={trip.status}
                color={
                  trip.status === "completed"
                    ? "success"
                    : trip.status === "in-progress"
                    ? "info"
                    : trip.status === "planning"
                    ? "primary"
                    : "default"
                }
              />
              {trip.preferences?.travelStyle && (
                <Chip label={trip.preferences.travelStyle} variant="outlined" />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>

            {trip.preferences?.transportation && (
              <Box sx={{mb: 1}}>
                <Typography variant="body2" color="text.secondary">
                  Transportation:
                </Typography>
                <Box
                  sx={{display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5}}
                >
                  {trip.preferences.transportation.map((item, index) => (
                    <Chip key={index} label={item} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {trip.preferences?.interests && (
              <Box sx={{mb: 1}}>
                <Typography variant="body2" color="text.secondary">
                  Interests:
                </Typography>
                <Box
                  sx={{display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5}}
                >
                  {trip.preferences.interests.map((item, index) => (
                    <Chip key={index} label={item} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {trip.preferences?.accommodationType && (
              <Box sx={{mb: 1}}>
                <Typography variant="body2" color="text.secondary">
                  Accommodation: {trip.preferences.accommodationType}
                </Typography>
              </Box>
            )}

            <Box sx={{mt: 2}}>
              <Button
                variant="contained"
                color="secondary"
                disabled={optimizingBudget}
                onClick={handleOptimizeBudget}
              >
                {optimizingBudget ? "Optimizing..." : "Optimize Budget"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {trip.summary && (
        <Paper sx={{p: 3, mb: 4}}>
          <Typography variant="h5" gutterBottom>
            Trip Summary
          </Typography>
          <Divider sx={{mb: 2}} />

          {trip.summary.highlights && trip.summary.highlights.length > 0 && (
            <Box sx={{mb: 2}}>
              <Typography variant="h6" gutterBottom>
                Highlights
              </Typography>
              <ul>
                {trip.summary.highlights.map((highlight, index) => (
                  <li key={index}>
                    <Typography variant="body1">{highlight}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {trip.summary.mustTryExperiences &&
            trip.summary.mustTryExperiences.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Must-Try Experiences
                </Typography>
                <ul>
                  {trip.summary.mustTryExperiences.map((experience, index) => (
                    <li key={index}>
                      <Typography variant="body1">{experience}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
        </Paper>
      )}

      <EnhancedTripItinerary trip={trip} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your trip to {trip.destination}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTrip} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TripDetailsPage;
