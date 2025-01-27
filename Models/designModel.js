const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  images: { // Changed this from "image" to "images" to allow multiple images
    type: [String], // Array of image URLs
    required: true
  }
});

const Design = mongoose.model('Design', designSchema);

module.exports = Design;
