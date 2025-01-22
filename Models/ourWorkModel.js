const mongoose = require('mongoose');

const ourworkSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['logo', 'brochure', 'poster', 'flyer', 'packaging', 'ui/ux', 'icon', 'magazine', 'visual aid', 'stationary'],
    required: true,
    unique: true  // Ensuring unique category name
  },
  subCategory: {
    type: String,
    enum: ['envelope', 'menu-card', 'certificate', ''],  // Allow empty string for non-stationary categories
    required: function() {
      return this.category === 'stationary';  // Only require subCategory if the category is 'stationary'
    },
    default: ''
  },
  imageUrls: {
    type: [String],  
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OurWork = mongoose.model('OurWork', ourworkSchema);
module.exports = OurWork;
