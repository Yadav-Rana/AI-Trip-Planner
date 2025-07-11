import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RecommendationsList from "../components/recommendations/RecommendationsList";

const RecommendationsPage = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Get preferences from location state or localStorage
  const preferences = location.state?.preferences || 
    JSON.parse(localStorage.getItem("userPreferences"));
  
  useEffect(() => {
    // If no preferences are found, redirect to onboarding
    if (!preferences) {
      navigate("/onboarding");
    }
    
    // Store preferences in localStorage for persistence
    if (preferences && !localStorage.getItem("userPreferences")) {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    }
  }, [preferences, navigate]);
  
  const handleGoBack = () => {
    // Go back to dashboard or onboarding based on user state
    if (user?.preferences?.onboardingCompleted) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };
  
  const handleSelectDestination = (destination) => {
    // Store the destination in localStorage
    localStorage.setItem("selectedDestination", JSON.stringify(destination));
    
    // Navigate to destination details page
    navigate(`/destination/${encodeURIComponent(destination.name)}`);
  };
  
  if (!preferences) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Your Travel Recommendations
          </Typography>
        </Box>
        
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Based on Your Preferences
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Typography variant="body1">
              <strong>Budget:</strong> ₹{preferences.budget.min.toLocaleString()} - ₹{preferences.budget.max.toLocaleString()}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "primary.contrastText", opacity: 0.5 }} />
            <Typography variant="body1">
              <strong>Time Available:</strong> {preferences.timeAvailability.daysAvailable} days
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "primary.contrastText", opacity: 0.5 }} />
            <Typography variant="body1">
              <strong>Interests:</strong> {preferences.interests.join(", ")}
            </Typography>
          </Box>
        </Paper>
        
        <RecommendationsList 
          preferences={preferences} 
          onSelectDestination={handleSelectDestination} 
        />
      </Container>
    </Box>
  );
};

export default RecommendationsPage;
