import {useState, useEffect} from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
// Use the standard Grid component
import {Grid} from "@mui/material";
import {authAPI} from "../services/api";

const TRAVEL_STYLES = [
  "adventure",
  "relaxation",
  "cultural",
  "foodie",
  "budget",
  "luxury",
];

const TRANSPORTATION_OPTIONS = [
  "walking",
  "public transport",
  "taxi",
  "rental car",
  "bicycle",
  "tour bus",
];

const INTERESTS = [
  "museums",
  "history",
  "nature",
  "shopping",
  "nightlife",
  "beaches",
  "mountains",
  "food",
  "architecture",
  "art",
  "local experiences",
  "photography",
];

const ProfilePage = ({user, setUser}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: {
      budgetRange: {
        min: 0,
        max: 5000,
      },
      travelStyle: "adventure",
      preferredTransportation: ["walking", "public transport"],
      interests: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        preferences: {
          budgetRange: user.preferences?.budgetRange || {min: 0, max: 5000},
          travelStyle: user.preferences?.travelStyle || "adventure",
          preferredTransportation: user.preferences
            ?.preferredTransportation || ["walking", "public transport"],
          interests: user.preferences?.interests || [],
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const {name, value} = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleMultiSelectChange = (e) => {
    const {name, value} = e.target;
    const [parent, child] = name.split(".");

    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: value,
      },
    });
  };

  const handleBudgetChange = (event, newValue) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        budgetRange: {
          min: newValue[0],
          max: newValue[1],
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Only include password if it's provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        preferences: formData.preferences,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await authAPI.updateProfile(updateData);
      const updatedUser = response.data;

      // Update localStorage
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      // Update app state
      setUser(updatedUser);

      setSuccess("Profile updated successfully");

      // Clear passwords
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{mt: 4, mb: 8}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>

      {success && (
        <Alert severity="success" sx={{mb: 3}}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{mb: 3}}>
          {error}
        </Alert>
      )}

      <Paper sx={{p: 3}}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="password"
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                helperText="Leave blank to keep current password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{my: 4}} />

          <Typography variant="h6" gutterBottom>
            Travel Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Budget Range: ${formData.preferences.budgetRange.min} - $
                {formData.preferences.budgetRange.max}
              </Typography>
              <Slider
                value={[
                  formData.preferences.budgetRange.min,
                  formData.preferences.budgetRange.max,
                ]}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="transportation-label">
                  Preferred Transportation
                </InputLabel>
                <Select
                  labelId="transportation-label"
                  id="preferences.preferredTransportation"
                  name="preferences.preferredTransportation"
                  multiple
                  value={formData.preferences.preferredTransportation}
                  onChange={handleMultiSelectChange}
                  input={
                    <OutlinedInput
                      id="select-transportation"
                      label="Preferred Transportation"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
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
                  input={
                    <OutlinedInput id="select-interests" label="Interests" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
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

          <Box sx={{mt: 4, display: "flex", justifyContent: "flex-end"}}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{minWidth: 150}}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
