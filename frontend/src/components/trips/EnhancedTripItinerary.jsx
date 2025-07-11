import {useState} from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {motion, AnimatePresence} from "framer-motion";
// Use the standard Grid component
import {Grid} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import AttractionsIcon from "@mui/icons-material/Attractions";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MapIcon from "@mui/icons-material/Map";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WarningIcon from "@mui/icons-material/Warning";
import {geminiAPI} from "../../services/api";

const EnhancedTripItinerary = ({trip}) => {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    setLoading(true);

    try {
      const response = await geminiAPI.getPlaceDetails({
        placeName: place.name,
        destination: trip.destination,
        interests: trip.preferences?.interests || [],
      });

      setPlaceDetails(response.data);
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedPlace(null);
    setPlaceDetails(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "attraction":
        return <AttractionsIcon />;
      case "restaurant":
        return <RestaurantIcon />;
      case "accommodation":
        return <HotelIcon />;
      case "activity":
        return <DirectionsWalkIcon />;
      default:
        return <PlaceIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!trip.itinerary || trip.itinerary.length === 0) {
    return (
      <Paper sx={{p: 3, mt: 3}}>
        <Typography variant="h6" align="center">
          No itinerary available yet.
        </Typography>
      </Paper>
    );
  }

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
    <Box sx={{mt: 3}}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
              background: "linear-gradient(90deg, #2A6EF0 0%, #5B8FF9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            Your {trip.itinerary.length}-Day Itinerary for {trip.destination}
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Stepper
            activeStep={activeDay}
            orientation={isMobile ? "vertical" : "horizontal"}
            alternativeLabel={!isMobile}
            sx={{mb: 4}}
          >
            {trip.itinerary.map((day, index) => (
              <Step key={index}>
                <StepLabel
                  onClick={() => setActiveDay(index)}
                  sx={{cursor: "pointer"}}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Day {day.day}
                  </Typography>
                </StepLabel>
                {isMobile && (
                  <StepContent>{renderDayContent(day, index)}</StepContent>
                )}
              </Step>
            ))}
          </Stepper>
        </motion.div>

        {!isMobile && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.3}}
            >
              {renderDayContent(trip.itinerary[activeDay], activeDay)}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Place Details Dialog */}
      <Dialog
        open={!!selectedPlace}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          },
        }}
      >
        {selectedPlace && (
          <>
            <DialogTitle sx={{pb: 1}}>
              <Typography variant="h5" fontWeight={700}>
                {selectedPlace.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {trip.destination}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {loading ? (
                <Box sx={{py: 4, textAlign: "center"}}>
                  <CircularProgress size={40} />
                  <Typography sx={{mt: 2}}>
                    Loading detailed information...
                  </Typography>
                </Box>
              ) : placeDetails ? (
                <Box>
                  {placeDetails.imageUrl && (
                    <Card sx={{mb: 3, overflow: "hidden", borderRadius: 2}}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={placeDetails.imageUrl}
                        alt={placeDetails.name}
                        sx={{objectFit: "cover"}}
                      />
                    </Card>
                  )}

                  <Typography variant="body1" paragraph>
                    {placeDetails.description || selectedPlace.description}
                  </Typography>

                  {placeDetails.history && (
                    <Box sx={{mb: 3}}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        History
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {placeDetails.history}
                      </Typography>
                    </Box>
                  )}

                  {placeDetails.significance && (
                    <Box sx={{mb: 3}}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Significance
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {placeDetails.significance}
                      </Typography>
                    </Box>
                  )}

                  <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          <AccessTimeIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              verticalAlign: "middle",
                              color: "primary.main",
                            }}
                          />
                          Timing
                        </Typography>
                        {placeDetails.timing && (
                          <List dense disablePadding>
                            {placeDetails.timing.bestTimeOfDay && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Best Time of Day"
                                  secondary={placeDetails.timing.bestTimeOfDay}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                            {placeDetails.timing.bestSeason && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Best Season"
                                  secondary={placeDetails.timing.bestSeason}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                            {placeDetails.timing.openingHours && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Opening Hours"
                                  secondary={placeDetails.timing.openingHours}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                            {placeDetails.timing.timeRequired && (
                              <ListItem disablePadding>
                                <ListItemText
                                  primary="Time Required"
                                  secondary={placeDetails.timing.timeRequired}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                          </List>
                        )}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          <AttachMoneyIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              verticalAlign: "middle",
                              color: "primary.main",
                            }}
                          />
                          Costs
                        </Typography>
                        {placeDetails.costs && (
                          <List dense disablePadding>
                            {placeDetails.costs.entryFee && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Entry Fee"
                                  secondary={placeDetails.costs.entryFee}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                            {placeDetails.costs.guidedTour && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Guided Tour"
                                  secondary={placeDetails.costs.guidedTour}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                            {placeDetails.costs.audioGuide && (
                              <ListItem disablePadding sx={{pb: 1}}>
                                <ListItemText
                                  primary="Audio Guide"
                                  secondary={placeDetails.costs.audioGuide}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 600,
                                  }}
                                  secondaryTypographyProps={{variant: "body2"}}
                                />
                              </ListItem>
                            )}
                          </List>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  {placeDetails.tips && placeDetails.tips.length > 0 && (
                    <Box sx={{mb: 3}}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        <InfoIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            verticalAlign: "middle",
                            color: "primary.main",
                          }}
                        />
                        Tips
                      </Typography>
                      <List dense>
                        {placeDetails.tips.map((tip, index) => (
                          <ListItem key={index} sx={{pl: 0}}>
                            <ListItemIcon sx={{minWidth: 36}}>
                              <InfoIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {placeDetails.photographyTips &&
                    placeDetails.photographyTips.length > 0 && (
                      <Box sx={{mb: 3}}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          <PhotoCameraIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              verticalAlign: "middle",
                              color: "primary.main",
                            }}
                          />
                          Photography Tips
                        </Typography>
                        <List dense>
                          {placeDetails.photographyTips.map((tip, index) => (
                            <ListItem key={index} sx={{pl: 0}}>
                              <ListItemIcon sx={{minWidth: 36}}>
                                <PhotoCameraIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </ListItemIcon>
                              <ListItemText primary={tip} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                  {placeDetails.nearby && (
                    <Box sx={{mb: 3}}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        <PlaceIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            verticalAlign: "middle",
                            color: "primary.main",
                          }}
                        />
                        Nearby Places
                      </Typography>
                      <Grid container spacing={2}>
                        {placeDetails.nearby.attractions &&
                          placeDetails.nearby.attractions.length > 0 && (
                            <Grid item xs={12} sm={4}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                gutterBottom
                              >
                                Attractions
                              </Typography>
                              <List dense disablePadding>
                                {placeDetails.nearby.attractions.map(
                                  (place, index) => (
                                    <ListItem
                                      key={index}
                                      disablePadding
                                      sx={{pb: 0.5}}
                                    >
                                      <ListItemIcon sx={{minWidth: 24}}>
                                        <AttractionsIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={place}
                                        primaryTypographyProps={{
                                          variant: "body2",
                                        }}
                                      />
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </Grid>
                          )}

                        {placeDetails.nearby.restaurants &&
                          placeDetails.nearby.restaurants.length > 0 && (
                            <Grid item xs={12} sm={4}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                gutterBottom
                              >
                                Restaurants
                              </Typography>
                              <List dense disablePadding>
                                {placeDetails.nearby.restaurants.map(
                                  (place, index) => (
                                    <ListItem
                                      key={index}
                                      disablePadding
                                      sx={{pb: 0.5}}
                                    >
                                      <ListItemIcon sx={{minWidth: 24}}>
                                        <RestaurantIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={place}
                                        primaryTypographyProps={{
                                          variant: "body2",
                                        }}
                                      />
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </Grid>
                          )}

                        {placeDetails.nearby.shopping &&
                          placeDetails.nearby.shopping.length > 0 && (
                            <Grid item xs={12} sm={4}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                gutterBottom
                              >
                                Shopping
                              </Typography>
                              <List dense disablePadding>
                                {placeDetails.nearby.shopping.map(
                                  (place, index) => (
                                    <ListItem
                                      key={index}
                                      disablePadding
                                      sx={{pb: 0.5}}
                                    >
                                      <ListItemIcon sx={{minWidth: 24}}>
                                        <ShoppingBagIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={place}
                                        primaryTypographyProps={{
                                          variant: "body2",
                                        }}
                                      />
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </Grid>
                          )}
                      </Grid>
                    </Box>
                  )}

                  {placeDetails.googleMapsUrl && (
                    <Box sx={{mt: 3, textAlign: "center"}}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<MapIcon />}
                        component="a"
                        href={placeDetails.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Google Maps
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body1">
                  {selectedPlace.description}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );

  function renderDayContent(day, dayIndex) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Day {day.day} Plan
          </Typography>
          <Chip
            label={formatCurrency(day.totalDayCost || 0)}
            color="primary"
            variant="outlined"
            icon={<AttachMoneyIcon />}
            sx={{fontWeight: 600}}
          />
        </Box>

        <Divider sx={{mb: 3}} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              <AttractionsIcon
                fontSize="small"
                sx={{mr: 1, verticalAlign: "middle", color: "primary.main"}}
              />
              Places to Visit
            </Typography>

            <Box sx={{mb: 4}}>
              {day.places.map((place, placeIndex) => (
                <motion.div
                  key={placeIndex}
                  whileHover={{y: -5}}
                  transition={{type: "spring", stiffness: 300}}
                >
                  <Card
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <Grid container>
                      {place.imageUrl && (
                        <Grid item xs={12} sm={4}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={place.imageUrl}
                            alt={place.name}
                            sx={{height: "100%", objectFit: "cover"}}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12} sm={place.imageUrl ? 8 : 12}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {place.name}
                              </Typography>
                              <Box sx={{display: "flex", gap: 1, mb: 1}}>
                                <Chip
                                  size="small"
                                  label={place.category}
                                  color="primary"
                                  variant="outlined"
                                  icon={getCategoryIcon(place.category)}
                                />
                                <Chip
                                  size="small"
                                  label={place.estimatedTimeRequired}
                                  variant="outlined"
                                  icon={<AccessTimeIcon fontSize="small" />}
                                />
                              </Box>
                            </Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="primary.main"
                            >
                              {formatCurrency(place.estimatedCost || 0)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{mb: 1}}
                          >
                            {place.description.length > 150
                              ? `${place.description.substring(0, 150)}...`
                              : place.description}
                          </Typography>
                          {place.bestTimeToVisit && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              <AccessTimeIcon
                                fontSize="inherit"
                                sx={{mr: 0.5, verticalAlign: "middle"}}
                              />
                              Best time: {place.bestTimeToVisit}
                            </Typography>
                          )}
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{mb: 3}}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                <RestaurantIcon
                  fontSize="small"
                  sx={{mr: 1, verticalAlign: "middle", color: "primary.main"}}
                />
                Meals
              </Typography>
              {day.meals && day.meals.length > 0 ? (
                day.meals.map((meal, mealIndex) => (
                  <Paper
                    key={mealIndex}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </Typography>
                      <Chip
                        size="small"
                        label={formatCurrency(meal.estimatedCost || 0)}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2">{meal.suggestion}</Typography>
                    {meal.cuisine && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Cuisine: {meal.cuisine}
                      </Typography>
                    )}
                    {meal.specialDish && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        <LocalOfferIcon
                          fontSize="inherit"
                          sx={{mr: 0.5, verticalAlign: "middle"}}
                        />
                        Must try: {meal.specialDish}
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No meal recommendations available for this day.
                </Typography>
              )}
            </Box>

            <Box sx={{mb: 3}}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                <DirectionsWalkIcon
                  fontSize="small"
                  sx={{mr: 1, verticalAlign: "middle", color: "primary.main"}}
                />
                Transportation
              </Typography>
              {day.transportation ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {day.transportation.mode.charAt(0).toUpperCase() +
                        day.transportation.mode.slice(1)}
                    </Typography>
                    <Chip
                      size="small"
                      label={formatCurrency(
                        day.transportation.estimatedCost || 0
                      )}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  {day.transportation.details && (
                    <Typography variant="body2">
                      {day.transportation.details}
                    </Typography>
                  )}
                </Paper>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No transportation details available for this day.
                </Typography>
              )}
            </Box>

            {day.accommodation && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  <HotelIcon
                    fontSize="small"
                    sx={{mr: 1, verticalAlign: "middle", color: "primary.main"}}
                  />
                  Accommodation
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {day.accommodation.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={formatCurrency(
                        day.accommodation.estimatedCost || 0
                      )}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    Type: {day.accommodation.type}
                  </Typography>
                  {day.accommodation.location && (
                    <Typography variant="body2" gutterBottom>
                      Location: {day.accommodation.location}
                    </Typography>
                  )}
                  {day.accommodation.amenities &&
                    day.accommodation.amenities.length > 0 && (
                      <Box sx={{mt: 1}}>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          gutterBottom
                        >
                          Amenities:
                        </Typography>
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                          {day.accommodation.amenities.map((amenity, index) => (
                            <Chip key={index} size="small" label={amenity} />
                          ))}
                        </Box>
                      </Box>
                    )}
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{mt: 3, display: "flex", justifyContent: "space-between"}}>
          <Button
            variant="outlined"
            disabled={dayIndex === 0}
            onClick={() => setActiveDay(dayIndex - 1)}
          >
            Previous Day
          </Button>
          <Button
            variant="contained"
            disabled={dayIndex === trip.itinerary.length - 1}
            onClick={() => setActiveDay(dayIndex + 1)}
          >
            Next Day
          </Button>
        </Box>
      </Paper>
    );
  }
};

export default EnhancedTripItinerary;
