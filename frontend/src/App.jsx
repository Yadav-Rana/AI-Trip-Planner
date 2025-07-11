import {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {AnimatePresence} from "framer-motion";

// Import fonts
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

import "./App.css";

// Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TripPlannerPage from "./pages/TripPlannerPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import DestinationDetails from "./pages/DestinationDetails";
import RecommendationsPage from "./pages/RecommendationsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import FAQsPage from "./pages/FAQsPage";
import ContactPage from "./pages/ContactPage";
import FeedbackPage from "./pages/FeedbackPage";
import WishlistPage from "./pages/WishlistPage";
import {WishlistProvider} from "./contexts/WishlistContext";

// Create a custom theme with enhanced colors and typography
let theme = createTheme({
  palette: {
    primary: {
      main: "#2A6EF0", // Vibrant blue
      light: "#5B8FF9",
      dark: "#1A4BC0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF6B6B", // Coral red
      light: "#FF9E9E",
      dark: "#E54B4B",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D3748",
      secondary: "#718096",
    },
    success: {
      main: "#48BB78",
    },
    warning: {
      main: "#F6AD55",
    },
    error: {
      main: "#F56565",
    },
    info: {
      main: "#4299E1",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: "10px 24px",
          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

// AnimatedRoutes component for page transitions
const AnimatedRoutes = ({user, setUser}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage user={user} />} />
        <Route
          path="/login"
          element={
            !user ? (
              <LoginPage setUser={setUser} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <RegisterPage setUser={setUser} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            user ? (
              <OnboardingPage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.preferences?.onboardingCompleted ? (
                <DashboardPage user={user} />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/trip-planner"
          element={
            user ? (
              user.preferences?.onboardingCompleted ? (
                <TripPlannerPage user={user} />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/trips/:id"
          element={
            user ? (
              user.preferences?.onboardingCompleted ? (
                <TripDetailsPage user={user} />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/recommendations"
          element={
            user ? (
              <RecommendationsPage user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/destination/:destinationName"
          element={user ? <DestinationDetails /> : <Navigate to="/login" />}
        />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route
          path="/wishlist"
          element={user ? <WishlistPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <WishlistProvider>
          <Header user={user} setUser={setUser} />
          <main className="app-main">
            <AnimatedRoutes user={user} setUser={setUser} />
          </main>
          <Footer />
        </WishlistProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
