// models/card.js

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
