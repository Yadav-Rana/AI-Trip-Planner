import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import FeedbackIcon from "@mui/icons-material/Feedback";
import StarIcon from "@mui/icons-material/Star";

const feedbackCategories = [
  "User Interface",
  "Trip Recommendations",
  "Itinerary Planning",
  "Budget Estimation",
  "Mobile Experience",
  "Other",
];

const FeedbackPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    rating: 0,
    category: "",
    feedbackType: "suggestion",
    message: "",
    name: "",
    email: "",
    contactConsent: false,
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
    
    if (errors.rating) {
      setErrors((prev) => ({
        ...prev,
        rating: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = "Please provide a rating";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Please provide more detailed feedback";
    }
    
    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send the form data to your backend here
      console.log("Feedback submitted:", formData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Thank you for your feedback! We appreciate your input.",
        severity: "success",
      });
      
      // Reset form
      setFormData({
        rating: 0,
        category: "",
        feedbackType: "suggestion",
        message: "",
        name: "",
        email: "",
        contactConsent: false,
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              mb: 5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: "white",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Share Your Feedback
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 2, maxWidth: 700 }}>
              Your feedback helps us improve our service. Let us know what you think about Trip Planner and how we can make it better for you.
            </Typography>
          </Paper>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          How would you rate your experience?
                        </Typography>
                        <Rating
                          name="rating"
                          value={formData.rating}
                          onChange={handleRatingChange}
                          precision={1}
                          size="large"
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {errors.rating && (
                          <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                            {errors.rating}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="What area are you providing feedback on?"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={!!errors.category}
                        helperText={errors.category}
                        required
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value=""></option>
                        {feedbackCategories.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Feedback Type</FormLabel>
                        <RadioGroup
                          row
                          name="feedbackType"
                          value={formData.feedbackType}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="suggestion"
                            control={<Radio />}
                            label="Suggestion"
                          />
                          <FormControlLabel
                            value="issue"
                            control={<Radio />}
                            label="Issue"
                          />
                          <FormControlLabel
                            value="compliment"
                            control={<Radio />}
                            label="Compliment"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Feedback"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message || "Please be as specific as possible"}
                        required
                        placeholder="Share your thoughts, suggestions, or report an issue..."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Your Information (Optional)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Provide your contact information if you'd like us to follow up with you.
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="contactConsent"
                            checked={formData.contactConsent}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="I agree to be contacted about my feedback if necessary"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<SendIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontWeight: 600,
                        }}
                      >
                        Submit Feedback
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FeedbackIcon
                    sx={{ color: "primary.main", mr: 1.5, fontSize: 28 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Why Your Feedback Matters
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Your feedback is invaluable to us. It helps us understand what we're doing right and where we can improve. Every suggestion is reviewed by our team and considered for future updates.
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  What Happens Next?
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" paragraph>
                    Our team reviews all feedback within 48 hours
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    If you've reported an issue, we'll investigate and work on a solution
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    Suggestions are evaluated for inclusion in future updates
                  </Typography>
                  <Typography component="li" variant="body2">
                    If you provided contact information, we may reach out for more details
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default FeedbackPage;
