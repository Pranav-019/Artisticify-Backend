const mongoose = require('mongoose');

// Define the Package schema
const packageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Basic', 'Standard', 'Premium'], 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative'] 
  },
  features: { 
    type: [String], 
    required: true, 
    validate: {
      validator: function (v) {
        return v.length > 0; 
      },
      message: 'A package must have at least one feature.'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

// Export the Package model
module.exports = mongoose.model('Package', packageSchema);
