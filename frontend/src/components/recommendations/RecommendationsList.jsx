import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import {motion} from "framer-motion";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {generateRecommendations} from "../../services/geminiService";

// Predefined destination images for reliability
const destinationImages = {
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Jaipur:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Manali:
    "https://images.unsplash.com/photo-1558436378-fda9dc0b2727?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Rishikesh:
    "https://images.unsplash.com/photo-1584732200355-486c3c9aa00c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Darjeeling:
    "https://images.unsplash.com/photo-1544634076-a90160ddf22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Varanasi:
    "https://images.unsplash.com/photo-1561361058-c24cecae35ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Udaipur:
    "https://images.unsplash.com/photo-1599661046827-9a64bd68a8dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Munnar:
    "https://images.unsplash.com/photo-1609766428106-5a1ee2af7e89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Ladakh:
    "https://images.unsplash.com/photo-1589793907316-f94025b46850?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Andaman:
    "https://images.unsplash.com/photo-1586094676111-f5db38e76819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Coorg:
    "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Ooty: "https://images.unsplash.com/photo-1580889240911-ede6e66e8f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Shimla:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Hampi:
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Kolkata:
    "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Mumbai:
    "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Delhi:
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Bangalore:
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  Chennai:
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
};

const RecommendationsList = ({preferences, onSelectDestination}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Function to get reliable image URLs for destinations
  const getDestinationImage = (destinationName) => {
    // Check if we have a predefined image for this destination
    const exactMatch = destinationImages[destinationName];
    if (exactMatch) return exactMatch;

    // Try to find a partial match
    const destinationKey = Object.keys(destinationImages).find(
      (key) =>
        destinationName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(destinationName.toLowerCase())
    );

    if (destinationKey) return destinationImages[destinationKey];

    // If no match is found, use the image URL from the API response or a fallback
    const recommendation = recommendations.find(
      (r) => r.name === destinationName
    );
    return (
      recommendation?.imageUrl ||
      `https://source.unsplash.com/featured/?${encodeURIComponent(
        destinationName
      )},travel`
    );
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // If we don't have preferences yet, use default values for testing
        const userPreferences = preferences || {
          budget: {min: 10000, max: 30000},
          timeAvailability: {daysAvailable: 5, preferredSeason: "Winter"},
          interests: ["Nature", "Adventure", "Culture"],
          transportation: {
            hasOwnVehicle: false,
            preferredModes: ["Train", "Bus"],
          },
        };

        const data = await generateRecommendations(userPreferences);
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [preferences]);

  const handleSelectDestination = (destination) => {
    if (onSelectDestination) {
      onSelectDestination(destination);
    } else {
      // Store the destination in localStorage to access it on the details page
      localStorage.setItem("selectedDestination", JSON.stringify(destination));
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      navigate(`/destination/${encodeURIComponent(destination.name)}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          py: 8,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{mt: 3}}>
          Generating personalized recommendations...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
          Our AI is analyzing your preferences to find the perfect destinations
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          py: 8,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{mt: 3}}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{py: 8}}>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 2,
          }}
        >
          Your Personalized Recommendations
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            textAlign: "center",
            mb: 6,
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Based on your preferences, we've curated these destinations just for
          you. Click on any destination to explore detailed information.
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {recommendations.map((destination, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <motion.div
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.1}}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: theme.shadows[4],
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={getDestinationImage(destination.name)}
                  alt={destination.name}
                  sx={{objectFit: "cover"}}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(
                      destination.name
                    )},travel`;
                  }}
                />
                <CardContent sx={{flexGrow: 1, p: 3}}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{fontWeight: 700, mb: 1}}
                  >
                    {destination.name}
                  </Typography>

                  <Box sx={{display: "flex", gap: 1, mb: 2, flexWrap: "wrap"}}>
                    <Chip
                      icon={<CurrencyRupeeIcon />}
                      label={`₹${destination.totalCost.toLocaleString()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={destination.bestTimeToVisit}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {destination.description}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{mt: 2, mb: 1, fontWeight: 600}}
                  >
                    Top Attractions:
                  </Typography>

                  <Box
                    sx={{display: "flex", flexDirection: "column", gap: 0.5}}
                  >
                    {destination.topAttractions.map((attraction, i) => (
                      <Box key={i} sx={{display: "flex", alignItems: "center"}}>
                        <PlaceIcon
                          fontSize="small"
                          color="primary"
                          sx={{mr: 1, fontSize: 16}}
                        />
                        <Typography variant="body2">{attraction}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <Divider />

                <Box sx={{p: 2, backgroundColor: "background.paper"}}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleSelectDestination(destination)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      fontWeight: 600,
                    }}
                  >
                    Explore Details
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecommendationsList;
