import {useState, useEffect, useRef} from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {motion} from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

// Comprehensive list of travel interests
const INTEREST_CATEGORIES = [
  {
    category: "Nature & Outdoors",
    interests: [
      "Mountains",
      "Beaches",
      "Wildlife",
      "Hiking",
      "National Parks",
      "Lakes",
      "Waterfalls",
      "Bird Watching",
      "Camping",
      "Scenic Views",
    ],
  },
  {
    category: "Culture & Heritage",
    interests: [
      "Historical Sites",
      "Museums",
      "Temples",
      "Palaces",
      "Forts",
      "Architecture",
      "Local Traditions",
      "Festivals",
      "Art Galleries",
      "Religious Sites",
    ],
  },
  {
    category: "Food & Drink",
    interests: [
      "Street Food",
      "Fine Dining",
      "Local Cuisine",
      "Food Tours",
      "Cooking Classes",
      "Vegetarian Food",
      "Seafood",
      "Desserts",
      "Coffee Shops",
      "Regional Specialties",
    ],
  },
  {
    category: "Activities & Experiences",
    interests: [
      "Adventure Sports",
      "Shopping",
      "Photography",
      "Yoga & Wellness",
      "Nightlife",
      "Water Sports",
      "Cycling",
      "Trekking",
      "Boat Rides",
      "Hot Air Balloon",
    ],
  },
  {
    category: "Urban Exploration",
    interests: [
      "City Tours",
      "Markets",
      "Modern Architecture",
      "Public Parks",
      "Street Art",
      "Local Transportation",
      "Urban Photography",
      "Skylines",
      "Shopping Districts",
    ],
  },
];

const InterestsForm = ({formData, updateFormData}) => {
  const [interests, setInterests] = useState(formData.interests || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  // Use useEffect with a ref to prevent unnecessary updates
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Update parent form data when local state changes
    updateFormData({interests});
  }, [interests]); // Removed updateFormData from dependencies

  const handleToggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest && !interests.includes(customInterest)) {
      setInterests([...interests, customInterest]);
      setCustomInterest("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomInterest();
    }
  };

  // Filter interests based on search term
  const getFilteredInterests = (category) => {
    if (!searchTerm) return category.interests;
    return category.interests.filter((interest) =>
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0},
  };

  const chipVariants = {
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
          What are you interested in experiencing?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select your interests to help us recommend the best places and
          activities for your trip.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextField
          fullWidth
          placeholder="Search interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{mb: 3}}
        />
      </motion.div>

      <Box sx={{mb: 4}}>
        {INTEREST_CATEGORIES.map((category) => {
          const filteredInterests = getFilteredInterests(category);
          if (filteredInterests.length === 0) return null;

          return (
            <motion.div key={category.category} variants={itemVariants}>
              <Typography
                variant="subtitle1"
                sx={{fontWeight: 600, mt: 2, mb: 1}}
              >
                {category.category}
              </Typography>
              <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 2}}>
                {filteredInterests.map((interest) => (
                  <motion.div
                    key={interest}
                    initial="notSelected"
                    animate={
                      interests.includes(interest) ? "selected" : "notSelected"
                    }
                    variants={chipVariants}
                    transition={{type: "spring", stiffness: 500, damping: 30}}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                  >
                    <Chip
                      label={interest}
                      onClick={() => handleToggleInterest(interest)}
                      sx={{
                        fontWeight: interests.includes(interest) ? 600 : 400,
                        "&:hover": {
                          backgroundColor: interests.includes(interest)
                            ? "#2A6EF0"
                            : "#e0e0e0",
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <motion.div variants={itemVariants}>
        <Typography variant="subtitle1" sx={{fontWeight: 600, mt: 3, mb: 1}}>
          Add Custom Interest
        </Typography>
        <Box sx={{display: "flex", gap: 1}}>
          <TextField
            fullWidth
            placeholder="Enter your own interest..."
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton
            color="primary"
            onClick={handleAddCustomInterest}
            disabled={!customInterest}
            sx={{
              bgcolor: "primary.light",
              color: "white",
              "&:hover": {bgcolor: "primary.main"},
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </motion.div>

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
            Selected Interests ({interests.length})
          </Typography>
          {interests.length > 0 ? (
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onDelete={() => handleToggleInterest(interest)}
                  color="primary"
                  variant="outlined"
                  sx={{bgcolor: "rgba(255,255,255,0.2)"}}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2">
              No interests selected yet. Select some interests to get
              personalized recommendations.
            </Typography>
          )}
        </Paper>
      </motion.div>
    </motion.div>
  );
};

export default InterestsForm;
