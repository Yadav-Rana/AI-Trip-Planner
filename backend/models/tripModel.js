const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['attraction', 'restaurant', 'accommodation', 'activity'],
    required: true
  },
  estimatedCost: Number,
  estimatedTimeRequired: String,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [String],
  tips: [String]
});

const dayPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  places: [placeSchema],
  transportation: {
    mode: String,
    estimatedCost: Number
  },
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    suggestion: String,
    estimatedCost: Number
  }],
  totalDayCost: Number
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    total: Number,
    spent: {
      type: Number,
      default: 0
    },
    remaining: Number
  },
  preferences: {
    travelStyle: String,
    transportation: [String],
    interests: [String],
    accommodationType: String
  },
  itinerary: [dayPlanSchema],
  summary: {
    highlights: [String],
    totalCost: Number,
    mustTryExperiences: [String]
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  }
}, {
  timestamps: true
});

// Calculate trip duration
tripSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Calculate remaining budget
tripSchema.pre('save', function(next) {
  if (this.budget.total) {
    this.budget.remaining = this.budget.total - this.budget.spent;
  }
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
