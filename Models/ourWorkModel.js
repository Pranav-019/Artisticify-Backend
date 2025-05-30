const mongoose = require('mongoose');

const ourworkSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'logo',
      'brochure',
      'poster',
      'flyer',
      'packaging',
      'ui/ux',
      'icon',
      'magazine',
      'visual aid',
      'stationary',
    ],
    required: true,
  },
  images: {
    type: [String], // This ensures the field is an array of strings
    required: true,  // Optional, if you want to make sure there is at least one image URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OurWork = mongoose.model('OurWork', ourworkSchema);
module.exports = OurWork;
