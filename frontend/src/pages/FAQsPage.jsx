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
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

const faqCategories = [
  {
    name: "General",
    faqs: [
      {
        question: "What is Trip Planner?",
        answer:
          "Trip Planner is an AI-powered travel planning platform that helps you create personalized travel itineraries based on your preferences, budget, and interests. Our app uses advanced AI to recommend destinations, attractions, accommodations, and activities tailored to your specific needs.",
      },
      {
        question: "Is Trip Planner free to use?",
        answer:
          "Yes, the basic features of Trip Planner are free to use. This includes creating an account, getting personalized recommendations, and planning basic trips. We also offer premium features for advanced planning needs, which are available through subscription plans.",
      },
      {
        question: "How does Trip Planner generate recommendations?",
        answer:
          "Trip Planner uses a combination of AI technology and travel data to generate personalized recommendations. We analyze your preferences, budget constraints, time availability, and interests to suggest destinations and activities that match your specific requirements. Our recommendations are continuously improved based on user feedback and travel trends.",
      },
    ],
  },
  {
    name: "Account",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the 'Sign Up' button on the homepage. Fill in your details including name, email, and password. Verify your email address through the link sent to your inbox, and you're all set to start planning your trips!",
      },
      {
        question: "Can I use Trip Planner without creating an account?",
        answer:
          "While you can browse the homepage without an account, creating an account is necessary to access personalized recommendations, save trips, and use most features of the app.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
      },
    ],
  },
  {
    name: "Trip Planning",
    faqs: [
      {
        question: "How do I start planning a trip?",
        answer:
          "After logging in, you can start planning a trip by clicking on the 'Plan a Trip' button on your dashboard. Fill in your preferences including budget, time availability, interests, and transportation preferences. Our AI will then generate personalized recommendations based on your inputs.",
      },
      {
        question: "Can I modify the generated itinerary?",
        answer:
          "Yes, you can customize any aspect of the generated itinerary. Add or remove attractions, change accommodation options, adjust the schedule, or modify the budget allocation according to your preferences. The itinerary is fully flexible to meet your specific needs.",
      },
      {
        question: "How accurate are the cost estimates?",
        answer:
          "Our cost estimates are based on current market rates and are regularly updated. However, actual costs may vary based on seasonality, availability, and other factors. We recommend using them as a guideline and budgeting some extra for unexpected expenses.",
      },
      {
        question: "Can I save multiple trip plans?",
        answer:
          "Yes, you can save multiple trip plans in your account. This allows you to compare different options or plan for future trips. You can access all your saved trips from your dashboard.",
      },
    ],
  },
  {
    name: "Features",
    faqs: [
      {
        question: "Can I share my trip plans with others?",
        answer:
          "Yes, you can share your trip plans with friends and family. Each trip has a 'Share' option that allows you to send a link via email or generate a shareable link that you can send through any messaging platform.",
      },
      {
        question: "Does Trip Planner work offline?",
        answer:
          "Trip Planner requires an internet connection to generate recommendations and access most features. However, you can download your itineraries as PDFs for offline access during your travels.",
      },
      {
        question: "Can I book flights, hotels, and activities through Trip Planner?",
        answer:
          "Currently, Trip Planner provides recommendations and planning tools but does not offer direct booking services. We provide links to trusted booking platforms where you can complete your reservations.",
      },
    ],
  },
  {
    name: "Technical",
    faqs: [
      {
        question: "Which browsers are supported?",
        answer:
          "Trip Planner works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of these browsers.",
      },
      {
        question: "Is there a mobile app available?",
        answer:
          "Yes, Trip Planner is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store. The mobile app offers the same features as the web version with additional offline capabilities.",
      },
      {
        question: "How is my data protected?",
        answer:
          "We take data security seriously. All your personal information and trip details are encrypted and stored securely. We do not share your data with third parties without your consent. You can review our privacy policy for more details on how we handle your data.",
      },
    ],
  },
];

const FAQsPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter FAQs based on search query and selected category
  const filteredFAQs = faqCategories
    .filter(
      (category) => selectedCategory === "All" || category.name === selectedCategory
    )
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

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
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: 700 }}>
              Find answers to common questions about Trip Planner and how to make the most of your travel planning experience.
            </Typography>

            <TextField
              fullWidth
              placeholder="Search for questions..."
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

        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="All Categories"
            onClick={() => setSelectedCategory("All")}
            color={selectedCategory === "All" ? "primary" : "default"}
            variant={selectedCategory === "All" ? "filled" : "outlined"}
            sx={{ fontWeight: 500 }}
          />
          {faqCategories.map((category) => (
            <Chip
              key={category.name}
              label={category.name}
              onClick={() => setSelectedCategory(category.name)}
              color={selectedCategory === category.name ? "primary" : "default"}
              variant={selectedCategory === category.name ? "filled" : "outlined"}
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>

        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, categoryIndex) => (
            <Box key={category.name} sx={{ mb: 4 }}>
              {selectedCategory === "All" && (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  {category.name}
                </Typography>
              )}

              {category.faqs.map((faq, faqIndex) => (
                <motion.div
                  key={faqIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: (categoryIndex * category.faqs.length + faqIndex) * 0.05,
                  }}
                >
                  <Accordion
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
                        "&.Mui-expanded": {
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                        },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}

              {categoryIndex < filteredFAQs.length - 1 && selectedCategory === "All" && (
                <Divider sx={{ my: 4 }} />
              )}
            </Box>
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
            <Typography variant="h6" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or browse all categories
            </Typography>
          </Paper>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 6,
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Still have questions?
          </Typography>
          <Typography variant="body1" paragraph>
            Our support team is here to help. Contact us for personalized assistance.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Chip
              label="Contact Support"
              component="a"
              href="/contact"
              clickable
              sx={{
                bgcolor: "white",
                color: "primary.main",
                fontWeight: 600,
                fontSize: "1rem",
                py: 2.5,
                px: 1,
              }}
            />
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQsPage;
