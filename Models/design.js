const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['logo-design', 'brochure-design','flyer-design','packaging-design','icon-design','uiux-design' ,'stationary-design','magazine-design','visualAid-design','poster-design','calendar-design','letterHead-design','envelope-design','visitingCard-design','certificate-design','menuCard-design'], 
    required: true
  },
  images: [
    {
      data: Buffer, 
      contentType: String 
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Design = mongoose.model('Design', designSchema);
module.exports = Design;
