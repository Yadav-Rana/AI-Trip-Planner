const Trip = require('../models/tripModel');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      preferences
    } = req.body;

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      budget: {
        total: budget.total,
        spent: 0,
        remaining: budget.total
      },
      preferences,
      itinerary: [],
      summary: {
        highlights: [],
        totalCost: 0,
        mustTryExperiences: []
      }
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all trips for a user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      const {
        destination,
        startDate,
        endDate,
        budget,
        preferences,
        itinerary,
        summary,
        status
      } = req.body;

      trip.destination = destination || trip.destination;
      trip.startDate = startDate || trip.startDate;
      trip.endDate = endDate || trip.endDate;
      
      if (budget) {
        trip.budget = {
          ...trip.budget,
          ...budget
        };
      }
      
      if (preferences) {
        trip.preferences = {
          ...trip.preferences,
          ...preferences
        };
      }
      
      if (itinerary) {
        trip.itinerary = itinerary;
      }
      
      if (summary) {
        trip.summary = {
          ...trip.summary,
          ...summary
        };
      }
      
      if (status) {
        trip.status = status;
      }

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      await trip.deleteOne();
      res.json({ message: 'Trip removed' });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update trip itinerary
// @route   PUT /api/trips/:id/itinerary
// @access  Private
const updateTripItinerary = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip && trip.user.toString() === req.user._id.toString()) {
      trip.itinerary = req.body.itinerary;
      
      // Recalculate total cost
      let totalCost = 0;
      trip.itinerary.forEach(day => {
        totalCost += day.totalDayCost || 0;
      });
      
      trip.summary.totalCost = totalCost;
      trip.budget.spent = totalCost;
      trip.budget.remaining = trip.budget.total - totalCost;

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  updateTripItinerary
};
