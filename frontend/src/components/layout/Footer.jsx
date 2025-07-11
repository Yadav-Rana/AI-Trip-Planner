import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// Use the standard Grid component
import {Grid} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {motion} from "framer-motion";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        py: {xs: 6, md: 8},
        px: 2,
        mt: "auto",
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.primary.main}11)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.secondary.light}22, ${theme.palette.secondary.main}11)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{position: "relative", zIndex: 1}}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5}}
            >
              <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                <FlightTakeoffIcon
                  sx={{mr: 1, color: "primary.main", fontSize: 28}}
                />
                <Typography variant="h5" color="text.primary" fontWeight={700}>
                  Trip Planner
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{mb: 3, maxWidth: 300}}
              >
                Plan your perfect trip with personalized recommendations based
                on your preferences and budget.
              </Typography>
              <Box sx={{display: "flex", gap: 1, mb: 3}}>
                <motion.div whileHover={{y: -3}} whileTap={{y: 0}}>
                  <IconButton
                    color="primary"
                    aria-label="Facebook"
                    size="small"
                    sx={{bgcolor: "action.hover"}}
                  >
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{y: -3}} whileTap={{y: 0}}>
                  <IconButton
                    color="primary"
                    aria-label="Twitter"
                    size="small"
                    sx={{bgcolor: "action.hover"}}
                  >
                    <TwitterIcon fontSize="small" />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{y: -3}} whileTap={{y: 0}}>
                  <IconButton
                    color="primary"
                    aria-label="Instagram"
                    size="small"
                    sx={{bgcolor: "action.hover"}}
                  >
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{y: -3}} whileTap={{y: 0}}>
                  <IconButton
                    color="primary"
                    aria-label="LinkedIn"
                    size="small"
                    sx={{bgcolor: "action.hover"}}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={6} md={2}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.1}}
            >
              <Typography
                variant="h6"
                color="text.primary"
                fontWeight={600}
                gutterBottom
              >
                Quick Links
              </Typography>
              <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
                {[
                  {title: "Home", path: "/"},
                  {title: "Plan a Trip", path: "/trip-planner"},
                  {title: "Dashboard", path: "/dashboard"},
                  {title: "Profile", path: "/profile"},
                ].map((link) => (
                  <motion.div
                    key={link.title}
                    whileHover={{x: 5}}
                    transition={{type: "spring", stiffness: 400}}
                  >
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": {color: "primary.main"},
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={6} md={2}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.2}}
            >
              <Typography
                variant="h6"
                color="text.primary"
                fontWeight={600}
                gutterBottom
              >
                Support
              </Typography>
              <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
                {[
                  {title: "Help Center", path: "/help"},
                  {title: "FAQs", path: "/faqs"},
                  {title: "Contact Us", path: "/contact"},
                  {title: "Feedback", path: "/feedback"},
                ].map((link) => (
                  <motion.div
                    key={link.title}
                    whileHover={{x: 5}}
                    transition={{type: "spring", stiffness: 400}}
                  >
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": {color: "primary.main"},
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.3}}
            >
              <Typography
                variant="h6"
                color="text.primary"
                fontWeight={600}
                gutterBottom
              >
                Legal
              </Typography>
              <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
                {[
                  {title: "Privacy Policy", path: "/privacy"},
                  {title: "Terms of Service", path: "/terms"},
                  {title: "Cookie Policy", path: "/cookies"},
                  {title: "Accessibility", path: "/accessibility"},
                ].map((link) => (
                  <motion.div
                    key={link.title}
                    whileHover={{x: 5}}
                    transition={{type: "spring", stiffness: 400}}
                  >
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      sx={{
                        textDecoration: "none",
                        "&:hover": {color: "primary.main"},
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{my: 4, opacity: 0.2}} />

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align={isMobile ? "center" : "left"}
          >
            © {new Date().getFullYear()} Trip Planner. All rights reserved.
          </Typography>
          <Box sx={{display: "flex", gap: 3}}>
            <Link
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                textDecoration: "none",
                "&:hover": {color: "primary.main"},
              }}
            >
              Privacy
            </Link>
            <Link
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                textDecoration: "none",
                "&:hover": {color: "primary.main"},
              }}
            >
              Terms
            </Link>
            <Link
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                textDecoration: "none",
                "&:hover": {color: "primary.main"},
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
