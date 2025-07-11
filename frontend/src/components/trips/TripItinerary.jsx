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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import AttractionsIcon from "@mui/icons-material/Attractions";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {geminiAPI} from "../../services/api";

const TripItinerary = ({trip}) => {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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
      default:
        return <PlaceIcon />;
    }
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

  return (
    <Box sx={{mt: 3}}>
      <Typography variant="h5" gutterBottom>
        Your {trip.itinerary.length}-Day Itinerary
      </Typography>

      <Stepper activeStep={activeDay} orientation="vertical">
        {trip.itinerary.map((day, index) => (
          <Step key={index}>
            <StepLabel
              onClick={() => setActiveDay(index)}
              sx={{cursor: "pointer"}}
            >
              <Typography variant="subtitle1">
                Day {day.day}: {day.places.length} Activities
              </Typography>
            </StepLabel>
            <StepContent>
              <Paper sx={{p: 3}}>
                <Box
                  sx={{display: "flex", justifyContent: "space-between", mb: 2}}
                >
                  <Typography variant="h6">Day {day.day} Plan</Typography>
                  <Chip
                    label={`$${day.totalDayCost || 0} estimated`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{mb: 2}} />

                <List>
                  {day.places.map((place, placeIndex) => (
                    <ListItem
                      key={placeIndex}
                      alignItems="flex-start"
                      sx={{
                        mb: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        "&:hover": {bgcolor: "action.hover"},
                      }}
                      onClick={() => handlePlaceClick(place)}
                      button
                    >
                      <ListItemIcon>
                        {getCategoryIcon(place.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {place.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${place.estimatedCost || 0}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {place.description}
                            </Typography>
                            <Box sx={{display: "flex", mt: 1, gap: 1}}>
                              <Chip
                                size="small"
                                label={place.category}
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={place.estimatedTimeRequired}
                                variant="outlined"
                              />
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {day.transportation && (
                  <Accordion sx={{mt: 2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <DirectionsWalkIcon sx={{mr: 1}} />
                        <Typography>Transportation</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Mode: {day.transportation.mode}
                      </Typography>
                      <Typography variant="body2">
                        Estimated Cost: ${day.transportation.estimatedCost || 0}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}

                {day.meals && day.meals.length > 0 && (
                  <Accordion sx={{mt: 2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <RestaurantIcon sx={{mr: 1}} />
                        <Typography>Meals</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {day.meals.map((meal, mealIndex) => (
                          <ListItem key={mealIndex}>
                            <ListItemText
                              primary={`${
                                meal.type.charAt(0).toUpperCase() +
                                meal.type.slice(1)
                              }: ${meal.suggestion}`}
                              secondary={`Estimated Cost: $${
                                meal.estimatedCost || 0
                              }`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Paper>

              <Box sx={{mt: 2}}>
                <Button
                  variant="contained"
                  onClick={() => setActiveDay(index + 1)}
                  sx={{mt: 1, mr: 1}}
                  disabled={index === trip.itinerary.length - 1}
                >
                  Next Day
                </Button>
                <Button
                  onClick={() => setActiveDay(index - 1)}
                  sx={{mt: 1, mr: 1}}
                  disabled={index === 0}
                >
                  Previous Day
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Place Details Dialog */}
      <Dialog
        open={!!selectedPlace}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPlace && (
          <>
            <DialogTitle>{selectedPlace.name}</DialogTitle>
            <DialogContent dividers>
              {loading ? (
                <Typography>Loading details...</Typography>
              ) : placeDetails ? (
                <Box>
                  <Typography variant="body1" paragraph>
                    {placeDetails.description || selectedPlace.description}
                  </Typography>

                  <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 2}}>
                    <Chip
                      icon={<AttachMoneyIcon />}
                      label={`$${selectedPlace.estimatedCost || 0}`}
                      variant="outlined"
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={selectedPlace.estimatedTimeRequired}
                      variant="outlined"
                    />
                  </Box>

                  {placeDetails.bestTimeToVisit && (
                    <Typography variant="body2" paragraph>
                      <strong>Best time to visit:</strong>{" "}
                      {placeDetails.bestTimeToVisit}
                    </Typography>
                  )}

                  {selectedPlace.tips && selectedPlace.tips.length > 0 && (
                    <Box sx={{mt: 2}}>
                      <Typography variant="subtitle1" gutterBottom>
                        Tips:
                      </Typography>
                      <List dense>
                        {selectedPlace.tips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {placeDetails.nearbyAttractions && (
                    <Box sx={{mt: 2}}>
                      <Typography variant="subtitle1" gutterBottom>
                        Nearby Attractions:
                      </Typography>
                      <Typography variant="body2">
                        {placeDetails.nearbyAttractions.join(", ")}
                      </Typography>
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
};

export default TripItinerary;
