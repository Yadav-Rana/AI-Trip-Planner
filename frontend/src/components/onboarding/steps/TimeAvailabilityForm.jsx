import {useState, useEffect, useRef} from "react";
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Paper,
  Grid,
  Switch,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {motion} from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const TimeAvailabilityForm = ({formData, updateFormData}) => {
  const [timeAvailability, setTimeAvailability] = useState({
    daysAvailable: formData.timeAvailability?.daysAvailable || 3,
    preferredSeason: formData.timeAvailability?.preferredSeason || "any",
    flexibleDates: formData.timeAvailability?.flexibleDates || true,
  });

  // Use useEffect with a ref to prevent unnecessary updates
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Update parent form data when local state changes
    updateFormData({timeAvailability});
  }, [timeAvailability]); // Removed updateFormData from dependencies

  const handleDaysChange = (event, newValue) => {
    setTimeAvailability((prev) => ({
      ...prev,
      daysAvailable: newValue,
    }));
  };

  const handleSeasonChange = (event) => {
    setTimeAvailability((prev) => ({
      ...prev,
      preferredSeason: event.target.value,
    }));
  };

  const handleFlexibleDatesChange = (event) => {
    setTimeAvailability((prev) => ({
      ...prev,
      flexibleDates: event.target.checked,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0},
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Typography variant="h5" gutterBottom sx={{fontWeight: 600, mb: 3}}>
          How much time do you have for your trip?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Let us know your time constraints so we can plan the perfect itinerary
          for you.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
          <AccessTimeIcon sx={{mr: 1, color: "primary.main"}} />
          <Typography variant="h6" gutterBottom>
            Trip Duration
          </Typography>
        </Box>
        <Typography gutterBottom>
          {timeAvailability.daysAvailable}{" "}
          {timeAvailability.daysAvailable === 1 ? "day" : "days"}
        </Typography>
        <Slider
          value={timeAvailability.daysAvailable}
          onChange={handleDaysChange}
          valueLabelDisplay="auto"
          min={1}
          max={30}
          step={1}
          marks={[
            {value: 1, label: "1 day"},
            {value: 7, label: "1 week"},
            {value: 14, label: "2 weeks"},
            {value: 30, label: "1 month"},
          ]}
          sx={{mb: 4}}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
          <CalendarMonthIcon sx={{mr: 1, color: "primary.main"}} />
          <Typography variant="h6" gutterBottom>
            Preferred Season
          </Typography>
        </Box>
        <FormControl fullWidth sx={{mb: 4}}>
          <InputLabel id="season-label">When do you plan to travel?</InputLabel>
          <Select
            labelId="season-label"
            id="season-select"
            value={timeAvailability.preferredSeason}
            label="When do you plan to travel?"
            onChange={handleSeasonChange}
          >
            <MenuItem value="any">Any time</MenuItem>
            <MenuItem value="winter">Winter (Dec-Feb)</MenuItem>
            <MenuItem value="spring">Spring (Mar-May)</MenuItem>
            <MenuItem value="summer">Summer (Jun-Aug)</MenuItem>
            <MenuItem value="monsoon">Monsoon (Jul-Sep)</MenuItem>
            <MenuItem value="autumn">Autumn (Sep-Nov)</MenuItem>
          </Select>
        </FormControl>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
          <EventAvailableIcon sx={{mr: 1, color: "primary.main"}} />
          <Typography variant="h6" gutterBottom>
            Date Flexibility
          </Typography>
        </Box>
        <Box sx={{display: "flex", alignItems: "center", mb: 4}}>
          <Switch
            checked={timeAvailability.flexibleDates}
            onChange={handleFlexibleDatesChange}
            color="primary"
          />
          <Typography>
            {timeAvailability.flexibleDates
              ? "My dates are flexible"
              : "I have specific dates in mind"}
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mt: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 600}}>
            Time Planning Tips
          </Typography>
          <Typography variant="body2">
            • For major cities, 2-3 days is usually sufficient
            <br />
            • For regions with multiple attractions, 4-7 days is recommended
            <br />
            • Consider travel time between destinations
            <br />• Different seasons offer unique experiences in India -
            monsoon for lush landscapes, winter for pleasant weather in most
            regions
          </Typography>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default TimeAvailabilityForm;
