const mongoose = require('mongoose');

const digitalMarketingSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [], 
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


const DigitalMarketing = mongoose.model('DigitalMarketing', digitalMarketingSchema);
module.exports = DigitalMarketing;
