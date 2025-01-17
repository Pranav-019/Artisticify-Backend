const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }], // URLs or paths for images
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }], // For non-nested categories
  subCategories: [subCategorySchema], // Only for Stationary
});

const OurWork = mongoose.model('OurWork', categorySchema);

module.exports = OurWork;
