import {useState, useEffect} from "react";
import {Link as RouterLink, useNavigate, useLocation} from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {motion} from "framer-motion";
import {useWishlist} from "../../contexts/WishlistContext";

// Hide header on scroll down, show on scroll up
function HideOnScroll(props) {
  const {children} = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = ({user, setUser}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const {wishlist} = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
    handleCloseUserMenu();
  };

  const pages = user
    ? [
        {title: "Dashboard", path: "/dashboard"},
        {title: "Plan a Trip", path: "/trip-planner"},
      ]
    : [];

  const settings = user
    ? [
        {title: "Profile", action: () => navigate("/profile")},
        {title: "Logout", action: handleLogout},
      ]
    : [];

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled
            ? "background.paper"
            : location.pathname === "/"
            ? "rgba(42, 110, 240, 0.9)"
            : "background.paper",
          color: scrolled
            ? "text.primary"
            : location.pathname === "/"
            ? "white"
            : "text.primary",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          borderBottom: scrolled ? 1 : 0,
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{py: scrolled ? 0.5 : 1}}>
            {/* Desktop Logo */}
            <motion.div
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5}}
              style={{display: "flex", alignItems: "center"}}
            >
              <Box
                sx={{display: {xs: "none", md: "flex"}, alignItems: "center"}}
              >
                <motion.div
                  whileHover={{rotate: [0, -10, 10, -10, 0], scale: 1.1}}
                  transition={{duration: 0.5}}
                >
                  <FlightTakeoffIcon
                    sx={{
                      mr: 1,
                      fontSize: 32,
                      color: scrolled
                        ? "primary.main"
                        : location.pathname === "/"
                        ? "#ffffff"
                        : "primary.main",
                      filter:
                        location.pathname === "/" && !scrolled
                          ? "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                          : "none",
                      bgcolor:
                        location.pathname === "/" && !scrolled
                          ? "rgba(0,0,0,0.3)"
                          : "transparent",
                      p: location.pathname === "/" && !scrolled ? 1 : 0,
                      borderRadius: "50%",
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h5"
                  noWrap
                  component={RouterLink}
                  to="/"
                  className={
                    location.pathname === "/" && !scrolled
                      ? "header-logo-text"
                      : ""
                  }
                  sx={{
                    mr: 2,
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                    background: scrolled
                      ? "none"
                      : location.pathname === "/"
                      ? "linear-gradient(90deg, #ffffff, #f0f0f0)"
                      : "none",
                    WebkitBackgroundClip:
                      location.pathname === "/" && !scrolled ? "text" : "none",
                    WebkitTextFillColor:
                      location.pathname === "/" && !scrolled
                        ? "transparent"
                        : "inherit",
                    textShadow:
                      location.pathname === "/" && !scrolled
                        ? "0 2px 10px rgba(255,255,255,0.9), 0 0 5px rgba(255,255,255,0.7)"
                        : "none",
                    backgroundColor:
                      location.pathname === "/" && !scrolled
                        ? "rgba(0,0,0,0.4)"
                        : "transparent",
                    padding:
                      location.pathname === "/" && !scrolled
                        ? "0.3rem 0.8rem"
                        : 0,
                    borderRadius:
                      location.pathname === "/" && !scrolled ? "4px" : 0,
                  }}
                >
                  TRIP PLANNER
                </Typography>
              </Box>
            </motion.div>

            {/* Mobile Menu */}
            <Box sx={{flexGrow: 0, display: {xs: "flex", md: "none"}}}>
              {user && (
                <motion.div whileTap={{scale: 0.9}}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    sx={{
                      bgcolor:
                        scrolled || location.pathname !== "/"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.1)",
                      "&:hover": {
                        bgcolor:
                          scrolled || location.pathname !== "/"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </motion.div>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: {xs: "block", md: "none"},
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    mt: 1.5,
                    "& .MuiMenuItem-root": {
                      py: 1.5,
                    },
                  },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => {
                      navigate(page.path);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center" fontWeight={500}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <Box
              sx={{
                flexGrow: 1,
                display: {xs: "flex", md: "none"},
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                style={{display: "flex", alignItems: "center"}}
              >
                <motion.div
                  whileHover={{rotate: [0, -10, 10, -10, 0]}}
                  transition={{duration: 0.5}}
                >
                  <FlightTakeoffIcon
                    sx={{
                      mr: 1,
                      fontSize: 28,
                      color: scrolled
                        ? "primary.main"
                        : location.pathname === "/"
                        ? "#ffffff"
                        : "primary.main",
                      filter:
                        location.pathname === "/" && !scrolled
                          ? "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                          : "none",
                      bgcolor:
                        location.pathname === "/" && !scrolled
                          ? "rgba(0,0,0,0.3)"
                          : "transparent",
                      p: location.pathname === "/" && !scrolled ? 1 : 0,
                      borderRadius: "50%",
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h6"
                  noWrap
                  component={RouterLink}
                  to="/"
                  className={
                    location.pathname === "/" && !scrolled
                      ? "header-logo-text"
                      : ""
                  }
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    letterSpacing: ".1rem",
                    color: "inherit",
                    textDecoration: "none",
                    background: scrolled
                      ? "none"
                      : location.pathname === "/"
                      ? "linear-gradient(90deg, #ffffff, #f0f0f0)"
                      : "none",
                    WebkitBackgroundClip:
                      location.pathname === "/" && !scrolled ? "text" : "none",
                    WebkitTextFillColor:
                      location.pathname === "/" && !scrolled
                        ? "transparent"
                        : "inherit",
                    textShadow:
                      location.pathname === "/" && !scrolled
                        ? "0 2px 10px rgba(255,255,255,0.9), 0 0 5px rgba(255,255,255,0.7)"
                        : "none",
                    backgroundColor:
                      location.pathname === "/" && !scrolled
                        ? "rgba(0,0,0,0.4)"
                        : "transparent",
                    padding:
                      location.pathname === "/" && !scrolled
                        ? "0.3rem 0.8rem"
                        : 0,
                    borderRadius:
                      location.pathname === "/" && !scrolled ? "4px" : 0,
                  }}
                >
                  TRIP PLANNER
                </Typography>
              </motion.div>
            </Box>

            {/* Desktop Menu */}
            <Box
              sx={{
                flexGrow: 1,
                display: {xs: "none", md: "flex"},
                justifyContent: "center",
              }}
            >
              <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
                style={{display: "flex"}}
              >
                {pages.map((page, index) => (
                  <motion.div
                    key={page.title}
                    whileHover={{y: -3}}
                    whileTap={{y: 0}}
                    transition={{type: "spring", stiffness: 400, damping: 10}}
                  >
                    <Button
                      component={RouterLink}
                      to={page.path}
                      onClick={handleCloseNavMenu}
                      sx={{
                        mx: 1,
                        my: 2,
                        px: 2,
                        color: scrolled
                          ? "text.primary"
                          : location.pathname === "/"
                          ? "white"
                          : "text.primary",
                        display: "block",
                        fontWeight: 600,
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 10,
                          left: "50%",
                          width: "0%",
                          height: 3,
                          bgcolor: "primary.main",
                          transition: "all 0.3s ease",
                          transform: "translateX(-50%)",
                          borderRadius: 3,
                          opacity: 0.7,
                        },
                        "&:hover::after": {
                          width: "40%",
                        },
                        ...(location.pathname === page.path && {
                          "&::after": {
                            width: "40%",
                            opacity: 1,
                          },
                        }),
                      }}
                    >
                      {page.title}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </Box>

            {/* Wishlist Button (only for logged in users) */}
            {user && (
              <Box sx={{mr: 2}}>
                <motion.div
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.5, delay: 0.15}}
                  whileHover={{scale: 1.1}}
                  whileTap={{scale: 0.9}}
                >
                  <Tooltip title="View Wishlist">
                    <IconButton
                      onClick={() => navigate("/wishlist")}
                      sx={{
                        color: scrolled
                          ? "primary.main"
                          : location.pathname === "/"
                          ? "white"
                          : "primary.main",
                        bgcolor:
                          location.pathname === "/" && !scrolled
                            ? "rgba(0,0,0,0.3)"
                            : "transparent",
                        "&:hover": {
                          bgcolor:
                            location.pathname === "/" && !scrolled
                              ? "rgba(0,0,0,0.5)"
                              : "rgba(0,0,0,0.1)",
                        },
                        position: "relative",
                      }}
                    >
                      <FavoriteIcon />
                      {wishlist.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "error.main",
                            color: "white",
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {wishlist.length}
                        </Box>
                      )}
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>
            )}

            {/* User Menu */}
            <Box sx={{flexGrow: 0}}>
              <motion.div
                initial={{opacity: 0, x: 20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.2}}
              >
                {user ? (
                  <>
                    <Tooltip title="Open settings">
                      <motion.div
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                      >
                        <IconButton
                          onClick={handleOpenUserMenu}
                          sx={{
                            p: 0.5,
                            border: 2,
                            borderColor: scrolled
                              ? "primary.main"
                              : location.pathname === "/"
                              ? "white"
                              : "primary.main",
                          }}
                        >
                          <Avatar
                            alt={user.name}
                            src="/static/images/avatar/2.jpg"
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "primary.main",
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        </IconButton>
                      </motion.div>
                    </Tooltip>
                    <Menu
                      sx={{
                        mt: "45px",
                        "& .MuiPaper-root": {
                          borderRadius: 2,
                          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          mt: 1.5,
                          minWidth: 180,
                          "& .MuiMenuItem-root": {
                            py: 1.5,
                          },
                        },
                      }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting.title}
                          onClick={() => {
                            setting.action();
                            handleCloseUserMenu();
                          }}
                        >
                          <Typography fontWeight={500}>
                            {setting.title}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Box sx={{display: "flex", gap: 2}}>
                    <motion.div
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="outlined"
                        sx={{
                          color: scrolled
                            ? "primary.main"
                            : location.pathname === "/"
                            ? "white"
                            : "primary.main",
                          borderColor: scrolled
                            ? "primary.main"
                            : location.pathname === "/"
                            ? "white"
                            : "primary.main",
                          borderWidth: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          "&:hover": {
                            borderWidth: 2,
                            backgroundColor:
                              scrolled || location.pathname !== "/"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        Login
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        color="secondary"
                        sx={{
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  </Box>
                )}
              </motion.div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
