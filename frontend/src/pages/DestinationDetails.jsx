import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useWishlist} from "../contexts/WishlistContext";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {motion} from "framer-motion";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DirectionsIcon from "@mui/icons-material/Directions";
import HotelIcon from "@mui/icons-material/Hotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {getDestinationDetails} from "../services/geminiService";

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

// Helper function to get reliable image URL for a destination
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

  // If no match is found, use a fallback
  return `https://source.unsplash.com/featured/?${encodeURIComponent(
    destinationName
  )},travel`;
};

// Image gallery component
const ImageGallery = ({images, destinationName}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Process images to ensure they have valid URLs
  const processedImages = images.map((img) => ({
    ...img,
    url:
      img.url && img.url.startsWith("http")
        ? img.url
        : getDestinationImage(destinationName),
  }));

  return (
    <Box sx={{mb: 4}}>
      <Box
        sx={{
          width: "100%",
          height: {xs: "250px", sm: "400px", md: "500px"},
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <motion.img
          key={selectedImage}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
          src={
            processedImages[selectedImage]?.url ||
            getDestinationImage(destinationName)
          }
          alt={processedImages[selectedImage]?.caption || destinationName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(
              destinationName
            )},travel`;
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 3,
          },
        }}
      >
        {processedImages.map((image, index) => (
          <Box
            key={index}
            onClick={() => setSelectedImage(index)}
            sx={{
              width: 100,
              height: 70,
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
              cursor: "pointer",
              border:
                selectedImage === index ? "3px solid" : "3px solid transparent",
              borderColor: "primary.main",
              transition: "all 0.2s",
            }}
          >
            <img
              src={image.url}
              alt={image.caption || `${destinationName} image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(
                  destinationName
                )},travel,${index}`;
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Budget breakdown component
const BudgetBreakdown = ({budget}) => {
  const theme = useTheme();

  const categories = [
    {
      name: "Accommodation",
      value: budget.accommodation.midRange * 3,
      color: theme.palette.primary.main,
    },
    {
      name: "Food",
      value: budget.food.midRange * 3 * 3,
      color: theme.palette.secondary.main,
    },
    {
      name: "Transportation",
      value: budget.transportation,
      color: theme.palette.success.main,
    },
    {
      name: "Activities",
      value: budget.activities,
      color: theme.palette.warning.main,
    },
    {name: "Shopping", value: budget.shopping, color: theme.palette.error.main},
  ];

  const total = categories.reduce((sum, category) => sum + category.value, 0);

  return (
    <Card sx={{mb: 4, borderRadius: 2, overflow: "hidden"}}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{fontWeight: 600}}>
          Budget Breakdown (₹{total.toLocaleString()})
        </Typography>

        <Box sx={{mt: 3}}>
          {categories.map((category, index) => (
            <Box key={index} sx={{mb: 2}}>
              <Box
                sx={{display: "flex", justifyContent: "space-between", mb: 0.5}}
              >
                <Typography variant="body2">{category.name}</Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹{category.value.toLocaleString()} (
                  {Math.round((category.value / total) * 100)}%)
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  bgcolor: "grey.200",
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${(category.value / total) * 100}%`,
                    bgcolor: category.color,
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{my: 2}} />

        <Typography variant="subtitle2" gutterBottom>
          Accommodation Options (per night):
        </Typography>
        <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
          <Chip
            label={`Budget: ₹${budget.accommodation.budget}`}
            size="small"
          />
          <Chip
            label={`Mid-range: ₹${budget.accommodation.midRange}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`Luxury: ₹${budget.accommodation.luxury}`}
            size="small"
            color="secondary"
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Food Options (per day):
        </Typography>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
          <Chip label={`Budget: ₹${budget.food.budget}`} size="small" />
          <Chip
            label={`Mid-range: ₹${budget.food.midRange}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`Luxury: ₹${budget.food.luxury}`}
            size="small"
            color="secondary"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Main component
const DestinationDetails = () => {
  const {destinationName} = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();

  const [destinationDetails, setDestinationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Get the destination and preferences from localStorage
        const selectedDestination = JSON.parse(
          localStorage.getItem("selectedDestination")
        );
        const userPreferences = JSON.parse(
          localStorage.getItem("userPreferences")
        );

        if (!selectedDestination || !userPreferences) {
          throw new Error("Destination information not found");
        }

        try {
          const details = await getDestinationDetails(
            selectedDestination,
            userPreferences
          );

          if (!details || typeof details !== "object") {
            throw new Error("Invalid destination details format");
          }

          setDestinationDetails(details);
        } catch (detailsError) {
          console.error("Error parsing destination details:", detailsError);

          // Create a fallback destination details object
          const fallbackDetails = {
            destination: selectedDestination.name,
            overview:
              selectedDestination.description ||
              "A beautiful destination waiting to be explored.",
            bestTimeToVisit:
              selectedDestination.bestTimeToVisit || "Year-round",
            daysRecommended: 3,
            budget: {
              total: selectedDestination.totalCost || 20000,
              accommodation: {budget: 2000, midRange: 4000, luxury: 8000},
              food: {budget: 500, midRange: 1000, luxury: 2000},
              transportation: 2000,
              activities: 3000,
              shopping: 2000,
            },
            attractions: [
              {
                name:
                  selectedDestination.topAttractions?.[0] ||
                  "Local Attractions",
                entryFee: 500,
                timeRequired: "2-3 hours",
                bestTimeToVisit: "Morning",
              },
              {
                name:
                  selectedDestination.topAttractions?.[1] || "Cultural Sites",
                entryFee: 300,
                timeRequired: "1-2 hours",
                bestTimeToVisit: "Afternoon",
              },
              {
                name:
                  selectedDestination.topAttractions?.[2] || "Natural Wonders",
                entryFee: 200,
                timeRequired: "2 hours",
                bestTimeToVisit: "Evening",
              },
            ],
            accommodation: [
              {
                name: "Budget Stay",
                type: "Budget",
                pricePerNight: 2000,
                location: "City Center",
                description: "Comfortable budget accommodation",
                amenities: ["WiFi", "AC"],
              },
              {
                name: "Mid-range Hotel",
                type: "Mid-range",
                pricePerNight: 4000,
                location: "Tourist Area",
                description: "Quality mid-range accommodation",
                amenities: ["WiFi", "AC", "Pool"],
              },
            ],
            activities: [
              {
                name: "Local Tour",
                description: "Explore the local area",
                cost: 1000,
                duration: "3 hours",
                difficulty: "Easy",
              },
              {
                name: "Adventure Activity",
                description: "Exciting outdoor experience",
                cost: 2000,
                duration: "4 hours",
                difficulty: "Moderate",
              },
            ],
            food: [
              {
                name: "Local Cuisine",
                type: "Local",
                priceRange: "Budget",
                mustTry: ["Specialty Dish 1", "Specialty Dish 2"],
                location: "City Center",
              },
              {
                name: "Fine Dining",
                type: "International",
                priceRange: "Luxury",
                mustTry: ["Signature Dish", "Chef Special"],
                location: "Hotel Zone",
              },
            ],
            transportation: {
              localOptions: ["Bus", "Auto", "Taxi"],
              costs: {bus: 20, auto: 100, taxi: 200},
              tips: "Local transportation is readily available and affordable.",
            },
            itinerary: [
              {
                day: 1,
                activities: [
                  {
                    time: "Morning",
                    activity: "Sightseeing",
                    description: "Visit the main attractions",
                  },
                  {
                    time: "Afternoon",
                    activity: "Lunch",
                    description: "Try local cuisine",
                  },
                  {
                    time: "Evening",
                    activity: "Relaxation",
                    description: "Enjoy the local atmosphere",
                  },
                ],
              },
              {
                day: 2,
                activities: [
                  {
                    time: "Morning",
                    activity: "Adventure",
                    description: "Outdoor activities",
                  },
                  {
                    time: "Afternoon",
                    activity: "Shopping",
                    description: "Buy local souvenirs",
                  },
                  {
                    time: "Evening",
                    activity: "Cultural Show",
                    description: "Experience local culture",
                  },
                ],
              },
            ],
            tips: [
              "Carry sufficient cash for small purchases",
              "Try the local cuisine",
              "Respect local customs and traditions",
            ],
            images: [
              {caption: "Beautiful views"},
              {caption: "Local culture"},
              {caption: "Amazing experiences"},
            ],
          };

          setDestinationDetails(fallbackDetails);
        }
      } catch (err) {
        console.error("Failed to fetch destination details:", err);
        setError("Failed to load destination details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [destinationName]);

  // Check if destination is in wishlist when details are loaded
  useEffect(() => {
    if (destinationDetails) {
      setInWishlist(isInWishlist(destinationDetails.destination));
    }
  }, [destinationDetails, isInWishlist]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(destinationDetails.destination);
      setInWishlist(false);
      setSnackbarMessage(
        `${destinationDetails.destination} removed from wishlist`
      );
    } else {
      // Create a simplified version of the destination for the wishlist
      const wishlistItem = {
        name: destinationDetails.destination,
        description: destinationDetails.overview,
        totalCost: destinationDetails.budget.total,
        bestTimeToVisit: destinationDetails.bestTimeToVisit,
        topAttractions: destinationDetails.attractions
          .slice(0, 3)
          .map((a) => a.name),
      };

      const added = addToWishlist(wishlistItem);
      if (added) {
        setInWishlist(true);
        setSnackbarMessage(
          `${destinationDetails.destination} added to wishlist`
        );
      } else {
        setSnackbarMessage(
          `${destinationDetails.destination} is already in your wishlist`
        );
      }
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{mt: 3}}>
          Loading destination details...
        </Typography>
      </Box>
    );
  }

  if (error || !destinationDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error || "Failed to load destination details"}
        </Typography>
        <Button variant="contained" sx={{mt: 3}} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{py: {xs: 4, md: 8}}}>
      <Container maxWidth="lg">
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/recommendations")}
          sx={{mb: 3}}
        >
          Back to Recommendations
        </Button>

        {/* Header section */}
        <Box sx={{mb: 6}}>
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{fontWeight: 700}}
            >
              {destinationDetails.destination}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Chip
                  icon={<CalendarMonthIcon />}
                  label={`${destinationDetails.daysRecommended} days recommended`}
                  color="primary"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Best time: ${destinationDetails.bestTimeToVisit}`}
                  color="secondary"
                />
                <Chip
                  icon={<CurrencyRupeeIcon />}
                  label={`Budget: ₹${destinationDetails.budget.total.toLocaleString()}`}
                  color="success"
                />
              </Box>

              <Button
                variant={inWishlist ? "contained" : "outlined"}
                color={inWishlist ? "error" : "primary"}
                startIcon={
                  inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />
                }
                onClick={handleWishlistToggle}
                sx={{minWidth: 150}}
              >
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </Box>

            <Typography variant="body1" paragraph>
              {destinationDetails.overview}
            </Typography>
          </motion.div>
        </Box>

        {/* Image gallery */}
        <ImageGallery
          images={destinationDetails.images}
          destinationName={destinationDetails.destination}
        />

        {/* Tabs navigation */}
        <Box sx={{borderBottom: 1, borderColor: "divider", mb: 4}}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            aria-label="destination details tabs"
          >
            <Tab icon={<CurrencyRupeeIcon />} label="Budget" />
            <Tab icon={<HotelIcon />} label="Accommodation" />
            <Tab icon={<LocalActivityIcon />} label="Attractions" />
            <Tab icon={<RestaurantIcon />} label="Food" />
            <Tab icon={<CalendarMonthIcon />} label="Itinerary" />
            <Tab icon={<TipsAndUpdatesIcon />} label="Tips" />
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box sx={{mb: 6}}>
          {/* Budget tab */}
          {tabValue === 0 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Budget Breakdown
              </Typography>
              <Typography variant="body1" paragraph>
                Here's a breakdown of estimated expenses for your trip to{" "}
                {destinationDetails.destination}. The total budget is
                approximately ₹
                {destinationDetails.budget.total.toLocaleString()}.
              </Typography>

              <BudgetBreakdown budget={destinationDetails.budget} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{mt: 4, fontWeight: 600}}
              >
                Transportation Options
              </Typography>
              <Paper sx={{p: 3, borderRadius: 2}}>
                <Typography variant="subtitle1" gutterBottom>
                  Local Transportation:
                </Typography>
                <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 2}}>
                  {destinationDetails.transportation.localOptions.map(
                    (option, index) => (
                      <Chip key={index} label={option} size="small" />
                    )
                  )}
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Estimated Costs:
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(destinationDetails.transportation.costs).map(
                    ([mode, cost], index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                          <DirectionsBusIcon
                            sx={{mr: 1, color: "primary.main"}}
                          />
                          <Typography>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}: ₹
                            {cost}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  )}
                </Grid>

                <Typography variant="subtitle1" sx={{mt: 2}}>
                  Transportation Tips:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {destinationDetails.transportation.tips}
                </Typography>
              </Paper>
            </motion.div>
          )}

          {/* Accommodation tab */}
          {tabValue === 1 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Accommodation Options
              </Typography>
              <Typography variant="body1" paragraph>
                Find the perfect place to stay in{" "}
                {destinationDetails.destination} based on your preferences.
              </Typography>

              <Grid container spacing={3}>
                {destinationDetails.accommodation.map((place, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{height: "100%", borderRadius: 2}}>
                      <Box sx={{p: 2, bgcolor: "primary.main"}}>
                        <Typography
                          variant="subtitle1"
                          sx={{color: "white", fontWeight: 600}}
                        >
                          {place.type}
                        </Typography>
                      </Box>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {place.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {place.description}
                        </Typography>

                        <Divider sx={{my: 1.5}} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            <PlaceIcon
                              fontSize="small"
                              sx={{verticalAlign: "middle", mr: 0.5}}
                            />
                            {place.location}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="primary"
                          >
                            ₹{place.pricePerNight}/night
                          </Typography>
                        </Box>

                        <Box sx={{mt: 2}}>
                          <Typography variant="subtitle2" gutterBottom>
                            Amenities:
                          </Typography>
                          <Box
                            sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}
                          >
                            {place.amenities.map((amenity, i) => (
                              <Chip
                                key={i}
                                label={amenity}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Attractions tab */}
          {tabValue === 2 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Top Attractions
              </Typography>
              <Typography variant="body1" paragraph>
                Discover the must-visit attractions in{" "}
                {destinationDetails.destination}.
              </Typography>

              <Grid container spacing={3}>
                {destinationDetails.attractions.map((attraction, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: {xs: "column", sm: "row"},
                        borderRadius: 2,
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: {xs: "100%", sm: 200},
                          height: {xs: 200, sm: "auto"},
                          objectFit: "cover",
                        }}
                        image={
                          attraction.imageUrl &&
                          attraction.imageUrl.startsWith("http")
                            ? attraction.imageUrl
                            : `https://source.unsplash.com/featured/?${encodeURIComponent(
                                attraction.name
                              )},attraction,${destinationDetails.destination}`
                        }
                        alt={attraction.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(
                            destinationDetails.destination
                          )},attraction`;
                        }}
                      />
                      <CardContent sx={{flex: 1}}>
                        <Typography variant="h6" gutterBottom>
                          {attraction.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {attraction.description}
                        </Typography>

                        <Divider sx={{my: 1.5}} />

                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Entry Fee
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{attraction.entryFee}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Time Required
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {attraction.timeRequired}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Best Time
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {attraction.bestTimeToVisit}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{mt: 4}}>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 600}}>
                  Activities
                </Typography>
                <Grid container spacing={3}>
                  {destinationDetails.activities.map((activity, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{height: "100%", borderRadius: 2}}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {activity.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {activity.description}
                          </Typography>

                          <Divider sx={{my: 1.5}} />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Chip
                              label={`₹${activity.cost}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={activity.duration}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                            <Chip
                              label={activity.difficulty}
                              size="small"
                              color="default"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          )}

          {/* Food tab */}
          {tabValue === 3 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Food & Dining
              </Typography>
              <Typography variant="body1" paragraph>
                Explore the culinary delights of{" "}
                {destinationDetails.destination}.
              </Typography>

              <Grid container spacing={3}>
                {destinationDetails.food.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{height: "100%", borderRadius: 2}}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.priceRange}
                            size="small"
                            color={
                              item.priceRange === "Budget"
                                ? "success"
                                : item.priceRange === "Mid-range"
                                ? "primary"
                                : "secondary"
                            }
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {item.type}
                        </Typography>

                        <Typography variant="body2" sx={{mb: 2}}>
                          <PlaceIcon
                            fontSize="small"
                            sx={{verticalAlign: "middle", mr: 0.5}}
                          />
                          {item.location}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Must Try:
                        </Typography>
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                          {item.mustTry.map((dish, i) => (
                            <Chip
                              key={i}
                              label={dish}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Itinerary tab */}
          {tabValue === 4 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Suggested Itinerary
              </Typography>
              <Typography variant="body1" paragraph>
                A day-by-day plan for your visit to{" "}
                {destinationDetails.destination}.
              </Typography>

              {destinationDetails.itinerary.map((day, index) => (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    "&:before": {display: "none"},
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{bgcolor: "primary.main", color: "white"}}
                  >
                    <Typography variant="h6">Day {day.day}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={{width: "100%"}}>
                      {day.activities.map((activity, actIndex) => (
                        <ListItem
                          key={actIndex}
                          alignItems="flex-start"
                          sx={{
                            px: 0,
                            borderBottom:
                              actIndex < day.activities.length - 1
                                ? "1px dashed"
                                : "none",
                            borderColor: "divider",
                          }}
                        >
                          <ListItemIcon sx={{minWidth: 42}}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  activity.time === "Morning"
                                    ? "primary.light"
                                    : activity.time === "Afternoon"
                                    ? "warning.light"
                                    : "secondary.light",
                                width: 32,
                                height: 32,
                              }}
                            >
                              {activity.time.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={500}>
                                {activity.time}: {activity.activity}
                              </Typography>
                            }
                            secondary={activity.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </motion.div>
          )}

          {/* Tips tab */}
          {tabValue === 5 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            >
              <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
                Travel Tips
              </Typography>
              <Typography variant="body1" paragraph>
                Helpful advice for your trip to {destinationDetails.destination}
                .
              </Typography>

              <Paper sx={{p: 3, borderRadius: 2}}>
                <List>
                  {destinationDetails.tips.map((tip, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        borderBottom:
                          index < destinationDetails.tips.length - 1
                            ? "1px solid"
                            : "none",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemIcon>
                        <TipsAndUpdatesIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </motion.div>
          )}
        </Box>

        {/* Call to action */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{fontWeight: 600}}>
            Ready to explore {destinationDetails.destination}?
          </Typography>
          <Typography variant="body1" paragraph>
            Start planning your trip now and create unforgettable memories!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{mt: 2, px: 4, py: 1.5, borderRadius: 2}}
          >
            Plan My Trip
          </Button>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{width: "100%"}}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DestinationDetails;
