import {useState, useEffect, useRef} from "react";
import {
  Box,
  Typography,
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
  Checkbox,
  FormGroup,
} from "@mui/material";
import {motion} from "framer-motion";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";

const TRANSPORTATION_OPTIONS = [
  {value: "walking", label: "Walking", icon: <DirectionsWalkIcon />},
  {
    value: "public_transport",
    label: "Public Transport",
    icon: <DirectionsBusIcon />,
  },
  {value: "train", label: "Train", icon: <TrainIcon />},
  {value: "taxi", label: "Taxi/Cab", icon: <LocalTaxiIcon />},
  {value: "rental_car", label: "Rental Car", icon: <DirectionsCarIcon />},
  {value: "bicycle", label: "Bicycle", icon: <DirectionsBikeIcon />},
  {value: "motorcycle", label: "Motorcycle", icon: <TwoWheelerIcon />},
  {value: "flight", label: "Flight", icon: <FlightIcon />},
];

const TransportationForm = ({formData, updateFormData}) => {
  const [transportation, setTransportation] = useState({
    hasOwnVehicle: formData.transportation?.hasOwnVehicle || false,
    vehicleType: formData.transportation?.vehicleType || "none",
    preferredModes: formData.transportation?.preferredModes || [
      "public_transport",
      "walking",
    ],
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
    updateFormData({transportation});
  }, [transportation]); // Removed updateFormData from dependencies

  const handleOwnVehicleChange = (event) => {
    setTransportation((prev) => ({
      ...prev,
      hasOwnVehicle: event.target.checked,
      vehicleType: event.target.checked ? prev.vehicleType : "none",
    }));
  };

  const handleVehicleTypeChange = (event) => {
    setTransportation((prev) => ({
      ...prev,
      vehicleType: event.target.value,
    }));
  };

  const handleTransportModeToggle = (mode) => {
    setTransportation((prev) => {
      const currentModes = [...prev.preferredModes];

      if (currentModes.includes(mode)) {
        return {
          ...prev,
          preferredModes: currentModes.filter((m) => m !== mode),
        };
      } else {
        return {
          ...prev,
          preferredModes: [...currentModes, mode],
        };
      }
    });
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

  const transportChipVariants = {
    selected: {
      scale: 1.05,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#2A6EF0",
      color: "#ffffff",
    },
    notSelected: {
      scale: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      backgroundColor: "#f5f5f5",
      color: "#333333",
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Typography variant="h5" gutterBottom sx={{fontWeight: 600, mb: 3}}>
          How would you like to get around?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Tell us about your transportation preferences so we can suggest the
          best ways to explore your destination.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
          <DirectionsCarIcon sx={{mr: 1, color: "primary.main"}} />
          <Typography variant="h6" gutterBottom sx={{mb: 0}}>
            Do you have your own vehicle?
          </Typography>
          <Switch
            checked={transportation.hasOwnVehicle}
            onChange={handleOwnVehicleChange}
            color="primary"
            sx={{ml: 2}}
          />
        </Box>
      </motion.div>

      {transportation.hasOwnVehicle && (
        <motion.div
          variants={itemVariants}
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: "auto"}}
          exit={{opacity: 0, height: 0}}
        >
          <FormControl component="fieldset" sx={{mb: 4, ml: 4}}>
            <FormLabel component="legend">Vehicle Type</FormLabel>
            <RadioGroup
              value={transportation.vehicleType}
              onChange={handleVehicleTypeChange}
            >
              <FormControlLabel value="car" control={<Radio />} label="Car" />
              <FormControlLabel
                value="motorcycle"
                control={<Radio />}
                label="Motorcycle/Scooter"
              />
              <FormControlLabel
                value="bicycle"
                control={<Radio />}
                label="Bicycle"
              />
            </RadioGroup>
          </FormControl>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Typography variant="h6" gutterBottom>
          Preferred Transportation Modes
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Select all the transportation options you're comfortable with:
        </Typography>

        <Box sx={{display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4}}>
          {TRANSPORTATION_OPTIONS.map((option) => (
            <motion.div
              key={option.value}
              initial="notSelected"
              animate={
                transportation.preferredModes.includes(option.value)
                  ? "selected"
                  : "notSelected"
              }
              variants={transportChipVariants}
              transition={{type: "spring", stiffness: 500, damping: 30}}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Chip
                icon={option.icon}
                label={option.label}
                onClick={() => handleTransportModeToggle(option.value)}
                sx={{
                  fontWeight: transportation.preferredModes.includes(
                    option.value
                  )
                    ? 600
                    : 400,
                  "&:hover": {
                    backgroundColor: transportation.preferredModes.includes(
                      option.value
                    )
                      ? "#2A6EF0"
                      : "#e0e0e0",
                  },
                  px: 1,
                }}
              />
            </motion.div>
          ))}
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
            Transportation Tips in India
          </Typography>
          <Typography variant="body2">
            • Public transportation varies greatly across different cities in
            India
            <br />
            • Metro systems are available in major cities like Delhi, Mumbai,
            and Bangalore
            <br />
            • Auto-rickshaws and taxis are common for short distances
            <br />
            • Trains are excellent for intercity travel
            <br />
            • Consider ride-sharing apps like Uber and Ola in urban areas
            <br />• For remote areas, having a private vehicle or hiring a
            driver may be necessary
          </Typography>
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default TransportationForm;
