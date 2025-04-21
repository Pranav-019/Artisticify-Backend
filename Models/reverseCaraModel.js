const mongoose = require('mongoose');

const reverseCaraSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ReverseCara', reverseCaraSchema);
