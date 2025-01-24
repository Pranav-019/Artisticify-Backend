
const mongoose = require('mongoose');


const ourworkSchema = new mongoose.Schema({
  category: {
    type: String,
<<<<<<< HEAD
    enum: ['logo', 'brochure','flyer','packaging','icon','ui/ux' ,'stationary','magazine','visual Aid','poster'], // List of categories (expand as needed)
=======
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
>>>>>>> bcf49f37be7dbbbe1f44053ce5a846bff04546f7
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
