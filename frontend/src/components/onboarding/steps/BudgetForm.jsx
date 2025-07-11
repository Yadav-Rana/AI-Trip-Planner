import {useState, useEffect, useRef} from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {motion} from "framer-motion";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const BudgetForm = ({formData, updateFormData}) => {
  const [budget, setBudget] = useState({
    min: formData.budget.min || 5000,
    max: formData.budget.max || 20000,
    currency: "INR",
  });
  const [budgetType, setBudgetType] = useState("range");

  // Use useEffect with a ref to prevent unnecessary updates
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Update parent form data when local state changes
    updateFormData({budget});
  }, [budget]); // Removed updateFormData from dependencies

  const handleSliderChange = (event, newValue) => {
    setBudget((prev) => ({
      ...prev,
      min: newValue[0],
      max: newValue[1],
    }));
  };

  const handleMinChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setBudget((prev) => ({
        ...prev,
        min: value,
      }));
    }
  };

  const handleMaxChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setBudget((prev) => ({
        ...prev,
        max: value,
      }));
    }
  };

  const handleFixedBudgetChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setBudget((prev) => ({
        ...prev,
        min: value,
        max: value,
      }));
    }
  };

  const handleBudgetTypeChange = (event) => {
    setBudgetType(event.target.value);
    if (event.target.value === "fixed") {
      setBudget((prev) => ({
        ...prev,
        min: prev.max,
        max: prev.max,
      }));
    }
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
          What's your budget for this trip?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Let us know your budget range in Indian Rupees (₹) so we can recommend
          suitable accommodations, activities, and dining options.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormControl component="fieldset" sx={{mb: 4}}>
          <FormLabel component="legend">Budget Type</FormLabel>
          <RadioGroup
            row
            name="budgetType"
            value={budgetType}
            onChange={handleBudgetTypeChange}
          >
            <FormControlLabel value="range" control={<Radio />} label="Range" />
            <FormControlLabel
              value="fixed"
              control={<Radio />}
              label="Fixed Amount"
            />
          </RadioGroup>
        </FormControl>
      </motion.div>

      {budgetType === "range" ? (
        <>
          <motion.div variants={itemVariants}>
            <Typography gutterBottom>
              Budget Range: ₹{budget.min.toLocaleString()} - ₹
              {budget.max.toLocaleString()}
            </Typography>
            <Slider
              value={[budget.min, budget.max]}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={1000}
              max={100000}
              step={1000}
              valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
              sx={{mb: 4}}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Budget"
                  value={budget.min}
                  onChange={handleMinChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Budget"
                  value={budget.max}
                  onChange={handleMaxChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <TextField
            fullWidth
            label="Fixed Budget Amount"
            value={budget.max}
            onChange={handleFixedBudgetChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
            sx={{mb: 4}}
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mt: 4,
            bgcolor: "primary.light",
            color: "primary.contrastText",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 600}}>
            Budget Tips
          </Typography>
          <Typography variant="body2">
            • A budget of ₹5,000-10,000 per day is suitable for budget travelers
            <br />
            • Mid-range travelers typically spend ₹10,000-20,000 per day
            <br />
            • Luxury experiences usually start from ₹20,000+ per day
            <br />• Remember to account for transportation, accommodation, food,
            activities, and shopping
          </Typography>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default BudgetForm;
