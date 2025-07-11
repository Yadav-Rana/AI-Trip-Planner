import {useNavigate} from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from "@mui/material";
// Use the standard Grid component
import {Grid} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExploreIcon from "@mui/icons-material/Explore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import MapIcon from "@mui/icons-material/Map";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import {motion} from "framer-motion";
import PageTransition from "../components/layout/PageTransition";
import {
  staggerContainer,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleUp,
} from "../components/layout/PageTransition";

// Animated background shapes component
const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </Box>
  );
};

const HomePage = ({user}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <PageTransition>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: {xs: 6, md: 10},
          mb: 6,
          position: "relative",
          overflow: "hidden",
          borderRadius: {xs: 0, md: "0 0 50px 50px"},
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <AnimatedBackground />
        <Container maxWidth="lg" sx={{position: "relative", zIndex: 1}}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeInLeft}>
                  <Typography
                    component="h1"
                    variant="h2"
                    color="inherit"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      fontSize: {xs: "2.5rem", md: "3.5rem"},
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                      mb: 3,
                    }}
                  >
                    Plan Your Perfect Trip
                  </Typography>
                </motion.div>
                <motion.div variants={fadeInLeft} transition={{delay: 0.1}}>
                  <Typography
                    variant="h5"
                    color="inherit"
                    paragraph
                    sx={{
                      fontWeight: 300,
                      mb: 4,
                      opacity: 0.9,
                      maxWidth: "90%",
                    }}
                  >
                    Get personalized travel recommendations based on your
                    preferences, budget, and interests. Let AI help you discover
                    the best places to visit, things to do, and food to try.
                  </Typography>
                </motion.div>
                <motion.div variants={fadeInUp} transition={{delay: 0.2}}>
                  <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                    {user ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/dashboard")}
                        startIcon={<ExploreIcon />}
                        sx={{
                          py: 1.5,
                          px: 3,
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        My Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          onClick={() => navigate("/register")}
                          startIcon={<ExploreIcon />}
                          sx={{
                            py: 1.5,
                            px: 3,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          Get Started
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="large"
                          onClick={() => navigate("/login")}
                          sx={{
                            py: 1.5,
                            px: 3,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            borderWidth: 2,
                          }}
                        >
                          Sign In
                        </Button>
                      </>
                    )}
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={scaleUp}
                  transition={{delay: 0.3}}
                  whileHover={{scale: 1.03}}
                  whileTap={{scale: 0.98}}
                >
                  <Paper
                    elevation={16}
                    sx={{
                      p: 3,
                      height: {xs: 250, md: 350},
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 6,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <FlightTakeoffIcon
                        sx={{
                          fontSize: {xs: 80, md: 120},
                          mb: 2,
                          opacity: 0.9,
                          color: "secondary.light",
                        }}
                      />
                    </motion.div>
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{
                        fontWeight: 700,
                        textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      Your Journey Begins Here
                    </Typography>

                    {/* Decorative elements */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -30,
                        left: -30,
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{mb: 8, mt: {xs: 4, md: 8}}}>
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-100px"}}
          transition={{duration: 0.6}}
        >
          <Typography
            variant="h3"
            align="center"
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
            Why Use Our Trip Planner?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: "700px",
              mx: "auto",
              fontSize: {xs: "1rem", md: "1.1rem"},
              mb: 6,
            }}
          >
            Our AI-powered trip planner helps you create the perfect itinerary
            tailored to your preferences, saving you time and ensuring you don't
            miss out on amazing experiences.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {[
            {
              icon: <ExploreIcon sx={{fontSize: 70, color: "primary.main"}} />,
              title: "Personalized Itineraries",
              description:
                "Get custom travel plans based on your interests, travel style, and preferences.",
              delay: 0,
            },
            {
              icon: (
                <AttachMoneyIcon sx={{fontSize: 70, color: "primary.main"}} />
              ),
              title: "Budget Management",
              description:
                "Track expenses and get recommendations that fit your budget constraints.",
              delay: 0.1,
            },
            {
              icon: (
                <LocalActivityIcon sx={{fontSize: 70, color: "primary.main"}} />
              ),
              title: "Hidden Gems",
              description:
                "Discover off-the-beaten-path attractions and local experiences you won't find in guidebooks.",
              delay: 0.2,
            },
            {
              icon: <MapIcon sx={{fontSize: 70, color: "primary.main"}} />,
              title: "Complete Details",
              description:
                "Get detailed information about places, including costs, tips, and time required for each activity.",
              delay: 0.3,
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-100px"}}
                transition={{duration: 0.5, delay: feature.delay}}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <motion.div
                    whileHover={{scale: 1.1, rotate: 5}}
                    transition={{type: "spring", stiffness: 400, damping: 10}}
                  >
                    {feature.icon}
                  </motion.div>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{flex: 1}}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          py: {xs: 8, md: 12},
          mb: 8,
          overflow: "hidden",
          borderRadius: {xs: 0, md: "50px"},
          mx: {xs: 0, md: 4},
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #FF6B6B 0%, #E54B4B 100%)",
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </Box>

        <Container maxWidth="md" sx={{position: "relative", zIndex: 1}}>
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.6}}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                mb: 3,
              }}
            >
              Ready to Plan Your Next Adventure?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              paragraph
              sx={{
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: "700px",
                mx: "auto",
                mb: 5,
              }}
            >
              Create an account today and start planning your dream trip with
              our AI-powered recommendations. It's free to get started!
            </Typography>
            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    backgroundColor: "white",
                    color: "secondary.main",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  startIcon={<AirplanemodeActiveIcon />}
                >
                  Sign Up Now
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Destinations Section */}
      <Container maxWidth="lg" sx={{mb: 10, pb: 4}}>
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-100px"}}
          transition={{duration: 0.6}}
        >
          <Typography
            variant="h3"
            align="center"
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
            Popular Destinations
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: "700px",
              mx: "auto",
              fontSize: {xs: "1rem", md: "1.1rem"},
              mb: 6,
            }}
          >
            Explore some of our users' favorite destinations and get inspired
            for your next adventure
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {[
            {city: "Paris", tagline: "The City of Lights", delay: 0},
            {
              city: "Tokyo",
              tagline: "Where Tradition Meets Future",
              delay: 0.1,
            },
            {
              city: "New York",
              tagline: "The City That Never Sleeps",
              delay: 0.2,
            },
            {city: "Bali", tagline: "Island of the Gods", delay: 0.3},
          ].map((destination) => (
            <Grid item key={destination.city} xs={12} sm={6} md={3}>
              <motion.div
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-100px"}}
                transition={{duration: 0.5, delay: destination.delay}}
                whileHover={{y: -10}}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: 4,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{position: "relative", overflow: "hidden"}}>
                    <motion.div
                      whileHover={{scale: 1.1}}
                      transition={{duration: 0.5}}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          pt: "70%",
                          bgcolor: "grey.300",
                        }}
                        image={`https://source.unsplash.com/featured/?${destination.city},travel`}
                      />
                    </motion.div>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        p: 2,
                        pt: 4,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {destination.city}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          fontWeight: 500,
                        }}
                      >
                        {destination.tagline}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{flexGrow: 1, p: 3}}>
                    <Typography variant="body1" sx={{mb: 2}}>
                      Discover the magic of {destination.city} with our
                      personalized trip plans.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate("/register")}
                      sx={{mt: "auto"}}
                    >
                      Explore {destination.city}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageTransition>
  );
};

export default HomePage;
