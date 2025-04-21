

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String},
  content: { type: String }
});

const seoBlogSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sections: [sectionSchema],
  createdAt: { type: Date, default: Date.now }
});

const SeoBlog = mongoose.model('SeoBlog', seoBlogSchema);

module.exports = SeoBlog;
