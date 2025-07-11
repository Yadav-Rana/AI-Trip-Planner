import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (email, password) => api.post('/users/login', { email, password }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Trip API
export const tripAPI = {
  createTrip: (tripData) => api.post('/trips', tripData),
  getTrips: () => api.get('/trips'),
  getTripById: (id) => api.get(`/trips/${id}`),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  updateItinerary: (id, itineraryData) => api.put(`/trips/${id}/itinerary`, { itinerary: itineraryData }),
};

// Gemini API
export const geminiAPI = {
  getTripRecommendations: (tripData) => api.post('/gemini/trip-recommendations', tripData),
  getPlaceDetails: (placeData) => api.post('/gemini/place-details', placeData),
  optimizeBudget: (tripPlan, budgetConstraint) => api.post('/gemini/optimize-budget', { tripPlan, budgetConstraint }),
};

export default api;
