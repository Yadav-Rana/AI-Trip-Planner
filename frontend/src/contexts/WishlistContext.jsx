import { createContext, useState, useContext, useEffect } from "react";

// Create the context
const WishlistContext = createContext();

// Custom hook to use the wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
        setWishlist([]);
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  
  // Add a destination to the wishlist
  const addToWishlist = (destination) => {
    // Check if destination is already in wishlist
    if (!wishlist.some(item => item.name === destination.name)) {
      setWishlist(prevWishlist => [...prevWishlist, destination]);
      return true; // Successfully added
    }
    return false; // Already in wishlist
  };
  
  // Remove a destination from the wishlist
  const removeFromWishlist = (destinationName) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(item => item.name !== destinationName)
    );
  };
  
  // Check if a destination is in the wishlist
  const isInWishlist = (destinationName) => {
    return wishlist.some(item => item.name === destinationName);
  };
  
  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };
  
  // Value object to be provided to consumers
  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
