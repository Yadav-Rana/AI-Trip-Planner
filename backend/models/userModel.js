const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  preferences: {
    budgetRange: {
      min: Number,
      max: Number
    },
    travelStyle: {
      type: String,
      enum: ['adventure', 'relaxation', 'cultural', 'foodie', 'budget', 'luxury'],
      default: 'adventure'
    },
    preferredTransportation: {
      type: [String],
      default: ['walking', 'public transport']
    },
    interests: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
