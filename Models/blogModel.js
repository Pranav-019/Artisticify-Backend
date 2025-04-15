// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'], // Required validation
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required'], // Required validation
//   },
//   image: {
//     type: String,
//     required: true, // Ensure image is provided
//   },
// });

// const Blog = mongoose.model('Blog', blogSchema);
// module.exports = Blog;


const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const seoBlogSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  sections: [sectionSchema],
  createdAt: { type: Date, default: Date.now }
});

const SeoBlog = mongoose.model('SeoBlog', seoBlogSchema);

module.exports = SeoBlog;
