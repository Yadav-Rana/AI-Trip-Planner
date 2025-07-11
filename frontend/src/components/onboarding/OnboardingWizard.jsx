import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {motion, AnimatePresence} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import BudgetForm from "./steps/BudgetForm";
import TimeAvailabilityForm from "./steps/TimeAvailabilityForm";
import InterestsForm from "./steps/InterestsForm";
import TransportationForm from "./steps/TransportationForm";
import RecommendationsList from "../recommendations/RecommendationsList";
import {authAPI} from "../../services/api";

const steps = ["Budget", "Time Availability", "Interests", "Transportation"];

const OnboardingWizard = ({user, setUser}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    budget: {
      min: 5000,
      max: 20000,
      currency: "INR",
    },
    timeAvailability: {
      daysAvailable: 3,
      preferredSeason: "any",
      flexibleDates: true,
    },
    interests: [],
    transportation: {
      hasOwnVehicle: false,
      preferredModes: [],
    },
    onboardingCompleted: false,
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Pre-fill form with user preferences if available
    if (user && user.preferences) {
      setFormData((prevData) => ({
        ...prevData,
        budget: {
          min: user.preferences.budgetRange?.min || 5000,
          max: user.preferences.budgetRange?.max || 20000,
          currency: "INR",
        },
        interests: user.preferences.interests || [],
        transportation: {
          hasOwnVehicle: user.preferences.hasOwnVehicle || false,
          preferredModes: user.preferences.preferredTransportation || [],
        },
        onboardingCompleted: user.preferences.onboardingCompleted || false,
      }));
    }
  }, [user]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdateFormData = (stepData) => {
    // Only update if the data has actually changed
    setFormData((prevData) => {
      // Check if the new data is different from the current data
      const keys = Object.keys(stepData);
      const hasChanged = keys.some((key) => {
        return JSON.stringify(prevData[key]) !== JSON.stringify(stepData[key]);
      });

      // Only update state if there's an actual change
      return hasChanged ? {...prevData, ...stepData} : prevData;
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare data for API
      const updatedPreferences = {
        budgetRange: {
          min: formData.budget.min,
          max: formData.budget.max,
        },
        interests: formData.interests,
        preferredTransportation: formData.transportation.preferredModes,
        hasOwnVehicle: formData.transportation.hasOwnVehicle,
        travelStyle: user?.preferences?.travelStyle || "adventure",
        onboardingCompleted: true,
      };

      // Check if user is authenticated
      if (user && localStorage.getItem("token")) {
        try {
          // Update user preferences
          const response = await authAPI.updateProfile({
            preferences: updatedPreferences,
          });

          // Update local user data
          const updatedUser = response.data;
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (apiError) {
          console.warn(
            "Failed to save preferences to server, but continuing with recommendations",
            apiError
          );
        }
      } else {
        // Store preferences in localStorage even if not logged in
        localStorage.setItem("userPreferences", JSON.stringify(formData));
      }

      // Show recommendations regardless of authentication status
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error updating preferences:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save your preferences. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRecommendations = () => {
    setShowRecommendations(false);
    // Navigate to the recommendations page with the form data
    navigate("/recommendations", {state: {preferences: formData}});
  };

  const handleSelectDestination = (destination) => {
    // Store the destination and preferences in localStorage
    localStorage.setItem("selectedDestination", JSON.stringify(destination));
    localStorage.setItem("userPreferences", JSON.stringify(formData));

    // Close the dialog and navigate to the destination details page
    setShowRecommendations(false);
    navigate(`/destination/${encodeURIComponent(destination.name)}`);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BudgetForm
            formData={formData}
            updateFormData={handleUpdateFormData}
          />
        );
      case 1:
        return (
          <TimeAvailabilityForm
            formData={formData}
            updateFormData={handleUpdateFormData}
          />
        );
      case 2:
        return (
          <InterestsForm
            formData={formData}
            updateFormData={handleUpdateFormData}
          />
        );
      case 3:
        return (
          <TransportationForm
            formData={formData}
            updateFormData={handleUpdateFormData}
          />
        );
      default:
        return "Unknown step";
    }
  };

  // Animation variants
  const pageVariants = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: -20},
  };

  return (
    <Container maxWidth="md" sx={{mt: 4, mb: 8}}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{duration: 0.4}}
      >
        <Paper
          elevation={3}
          sx={{
            p: {xs: 2, md: 4},
            borderRadius: 2,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              background: "linear-gradient(90deg, #2A6EF0 0%, #5B8FF9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            Let's Personalize Your Experience
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{mb: 4}}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{mb: 3}}>
              {error}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -20}}
              transition={{duration: 0.3}}
            >
              <Box sx={{mb: 4, minHeight: "300px"}}>
                {getStepContent(activeStep)}
              </Box>
            </motion.div>
          </AnimatePresence>

          <Box sx={{display: "flex", justifyContent: "space-between", pt: 2}}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{mr: 1}}
            >
              Back
            </Button>
            <Box sx={{flex: "1 1 auto"}} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleFinish}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Finish"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Recommendations Dialog */}
      <Dialog
        open={showRecommendations}
        fullWidth
        maxWidth="lg"
        onClose={handleCloseRecommendations}
        aria-labelledby="recommendations-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle id="recommendations-dialog-title" sx={{p: 3}}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" component="div" fontWeight={600}>
              Your Personalized Travel Recommendations
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseRecommendations}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{p: 0}}>
          <RecommendationsList
            preferences={formData}
            onSelectDestination={handleSelectDestination}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default OnboardingWizard;
