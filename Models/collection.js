const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Collection', CollectionSchema);
