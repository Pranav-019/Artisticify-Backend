const mongoose = require('mongoose');

const ourworkSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['logo', 'brochure', 'poster', 'flyer', 'packaging', 'ui/ux', 'icon', 'magazine', 'visual aid', 'stationary'],
    required: true,
    unique: true
  },
  subCategory: {
    type: String,
    enum: ['envelope', 'menu-card', 'certificate', ''],
    required: function() {
      return this.category === 'stationary';
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
