import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Chip,
  Paper,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {motion, AnimatePresence} from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExploreIcon from "@mui/icons-material/Explore";
// Removed unused imports
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import {useWishlist} from "../contexts/WishlistContext";

// Helper function to get a reliable image URL for a destination
const getDestinationImage = (destinationName) => {
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

const WishlistPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {wishlist, removeFromWishlist, clearWishlist} = useWishlist();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleExploreDestination = (destination) => {
    // Store the destination in localStorage
    localStorage.setItem("selectedDestination", JSON.stringify(destination));

    // Navigate to destination details page
    navigate(`/destination/${encodeURIComponent(destination.name)}`);
  };

  const handleRemoveClick = (destination) => {
    setDestinationToDelete(destination);
    setDeleteDialogOpen(true);
  };

  const confirmRemove = () => {
    if (destinationToDelete) {
      removeFromWishlist(destinationToDelete.name);
      setSnackbar({
        open: true,
        message: `${destinationToDelete.name} removed from wishlist`,
        severity: "success",
      });
    }
    setDeleteDialogOpen(false);
    setDestinationToDelete(null);
  };

  const handleClearWishlist = () => {
    setClearDialogOpen(true);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setClearDialogOpen(false);
    setSnackbar({
      open: true,
      message: "Wishlist cleared",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box sx={{py: 6}}>
      <Container maxWidth="lg">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
        >
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h3" component="h1" sx={{fontWeight: 700}}>
              My Wishlist
            </Typography>

            {wishlist.length > 0 && (
              <Box sx={{display: "flex", gap: 2}}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleClearWishlist}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Box>

          {wishlist.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 2,
                textAlign: "center",
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <FavoriteIcon
                sx={{fontSize: 60, color: "text.secondary", mb: 2}}
              />
              <Typography variant="h5" gutterBottom>
                Your wishlist is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>
                Start exploring destinations and add them to your wishlist!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExploreIcon />}
                onClick={() => navigate("/recommendations")}
                sx={{mt: 2}}
              >
                Explore Destinations
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {wishlist.map((destination, index) => (
                  <Grid item xs={12} sm={6} md={4} key={destination.name}>
                    <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.9}}
                      transition={{duration: 0.3, delay: index * 0.05}}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          overflow: "hidden",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            destination.imageUrl ||
                            getDestinationImage(destination.name)
                          }
                          alt={destination.name}
                          sx={{objectFit: "cover"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://source.unsplash.com/featured/?${encodeURIComponent(
                              destination.name
                            )},travel`;
                          }}
                        />

                        <CardContent sx={{flexGrow: 1}}>
                          <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{fontWeight: 700}}
                          >
                            {destination.name}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mb: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            {destination.totalCost && (
                              <Chip
                                icon={<CurrencyRupeeIcon />}
                                label={`₹${destination.totalCost.toLocaleString()}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                            {destination.bestTimeToVisit && (
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={destination.bestTimeToVisit}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </Box>

                          {destination.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{mb: 2}}
                            >
                              {destination.description.length > 100
                                ? `${destination.description.substring(
                                    0,
                                    100
                                  )}...`
                                : destination.description}
                            </Typography>
                          )}

                          {destination.topAttractions &&
                            destination.topAttractions.length > 0 && (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  sx={{fontWeight: 600, mb: 1}}
                                >
                                  Top Attractions:
                                </Typography>
                                {destination.topAttractions
                                  .slice(0, 2)
                                  .map((attraction, i) => (
                                    <Box
                                      key={i}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 0.5,
                                      }}
                                    >
                                      <PlaceIcon
                                        fontSize="small"
                                        color="primary"
                                        sx={{mr: 1, fontSize: 16}}
                                      />
                                      <Typography variant="body2">
                                        {attraction}
                                      </Typography>
                                    </Box>
                                  ))}
                              </Box>
                            )}
                        </CardContent>

                        <Divider />

                        <CardActions
                          sx={{p: 2, justifyContent: "space-between"}}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleExploreDestination(destination)
                            }
                          >
                            Explore
                          </Button>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveClick(destination)}
                            aria-label="remove from wishlist"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Remove from Wishlist</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {destinationToDelete?.name} from
              your wishlist?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmRemove} color="error" variant="contained">
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear Wishlist Confirmation Dialog */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
        >
          <DialogTitle>Clear Wishlist</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to clear your entire wishlist? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmClearWishlist}
              color="error"
              variant="contained"
            >
              Clear Wishlist
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{width: "100%"}}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default WishlistPage;
