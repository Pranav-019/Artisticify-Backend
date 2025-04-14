const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  boxNo: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  count: { type: String, required: true },
});

module.exports = mongoose.model("Counter", counterSchema);
