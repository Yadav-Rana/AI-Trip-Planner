import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Link } from "react-router-dom";

const helpTopics = [
  {
    title: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, and password. Verify your email address through the link sent to your inbox, and you're all set!",
      },
      {
        question: "What is the onboarding process?",
        answer:
          "The onboarding process helps us understand your travel preferences. You'll be asked about your budget range, time availability, interests, and transportation preferences. This information helps us provide personalized travel recommendations tailored to your needs.",
      },
      {
        question: "Can I use the app without creating an account?",
        answer:
          "While you can browse the homepage without an account, creating an account is necessary to access personalized recommendations, save trips, and use most features of the app.",
      },
    ],
  },
  {
    title: "Planning a Trip",
    questions: [
      {
        question: "How do I get travel recommendations?",
        answer:
          "After completing the onboarding process, you'll receive personalized travel recommendations based on your preferences. You can also create a new trip from your dashboard and get fresh recommendations anytime.",
      },
      {
        question: "Can I modify the recommendations?",
        answer:
          "Yes! You can customize any aspect of the recommended trips. Add or remove attractions, change accommodation options, adjust the itinerary, or modify the budget allocation according to your preferences.",
      },
      {
        question: "How accurate are the cost estimates?",
        answer:
          "Our cost estimates are based on current market rates and are regularly updated. However, actual costs may vary based on seasonality, availability, and other factors. We recommend using them as a guideline and budgeting some extra for unexpected expenses.",
      },
    ],
  },
  {
    title: "Account Management",
    questions: [
      {
        question: "How do I update my profile information?",
        answer:
          "Go to the Profile page by clicking on your avatar in the top right corner and selecting 'Profile'. Here you can update your personal information, change your password, and modify your travel preferences.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account from the Profile page. Go to Settings > Account > Delete Account. Please note that this action is irreversible and all your data will be permanently deleted.",
      },
      {
        question: "How do I change my password?",
        answer:
          "To change your password, go to Profile > Security. Enter your current password and then your new password twice to confirm. For security reasons, make sure to use a strong password with a mix of letters, numbers, and special characters.",
      },
    ],
  },
];

const HelpCenterPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(0);

  const handleCategoryChange = (panel) => (event, isExpanded) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  const filteredTopics = helpTopics.map((topic) => ({
    ...topic,
    questions: topic.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((topic) => topic.questions.length > 0);

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              mb: 5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: "white",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Help Center
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: 700 }}>
              Find answers to common questions and learn how to make the most of
              your trip planning experience.
            </Typography>

            <TextField
              fullWidth
              placeholder="Search for help topics..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 600,
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Frequently Asked Questions
            </Typography>

            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, topicIndex) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: topicIndex * 0.1 }}
                >
                  <Accordion
                    expanded={expandedCategory === topicIndex}
                    onChange={handleCategoryChange(topicIndex)}
                    elevation={0}
                    sx={{
                      mb: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                      overflow: "hidden",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        bgcolor: expandedCategory === topicIndex ? "primary.light" : "background.paper",
                        color: expandedCategory === topicIndex ? "primary.contrastText" : "text.primary",
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {topic.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {topic.questions.map((item, qIndex) => (
                        <Box key={qIndex} sx={{ mb: qIndex < topic.questions.length - 1 ? 3 : 0 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                          >
                            {item.question}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {item.answer}
                          </Typography>
                          {qIndex < topic.questions.length - 1 && (
                            <Divider sx={{ my: 2 }} />
                          )}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  border: `1px dashed ${theme.palette.divider}`,
                }}
              >
                <HelpOutlineIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try different keywords or browse the help categories
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Help Resources
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <BookmarkIcon
                      sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Guides & Tutorials
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Step-by-step guides to help you make the most of our trip
                    planning features.
                  </Typography>
                  <Button
                    component={Link}
                    to="/guides"
                    variant="outlined"
                    fullWidth
                  >
                    View Guides
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <ContactSupportIcon
                      sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Contact Support
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Can't find what you're looking for? Our support team is here
                    to help.
                  </Typography>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    fullWidth
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <FeedbackIcon
                      sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Give Feedback
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Help us improve by sharing your experience and suggestions.
                  </Typography>
                  <Button
                    component={Link}
                    to="/feedback"
                    variant="outlined"
                    fullWidth
                  >
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HelpCenterPage;
