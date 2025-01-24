
const mongoose = require('mongoose');


const ourworkSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['logo', 'brochure','flyer','packaging','icon','ui/ux' ,'stationary','magazine','visual Aid','poster'], // List of categories (expand as needed)
    required: true
  },
  images: [
    {
      data: Buffer, // Image data
      contentType: String // Content type (e.g., 'image/webp', 'image/png')
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model
const OurWork = mongoose.model('OurWork', ourworkSchema);

// Export the model
module.exports = OurWork;
