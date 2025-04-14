const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'], // Required validation
  },
  description: {
    type: String,
    required: [true, 'Description is required'], // Required validation
  },
  image: {
    type: String,
    required: true, // Ensure image is provided
  },
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
