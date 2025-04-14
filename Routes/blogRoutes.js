const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const Blog = require('../Models/blogModel');

// ImageKit SDK Configuration
const imagekit = new ImageKit({
  publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
  privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
  urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj" // Replace with your ImageKit URL endpoint
});

// Multer Configuration (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to create a new blog post with image upload
router.post('/insert', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    // Ensure title and description are provided
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Ensure image is provided
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/blogs',
    });

    // Save new blog post to MongoDB
    const newBlog = new Blog({
      title,
      description,
      image: uploadedImage.url, // Save the ImageKit URL
    });

    await newBlog.save();

    res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT route to update an existing blog post (with optional image update)
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    // Ensure the blog post exists
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Ensure title and description are provided
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;

    // Upload new image if provided
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/blogs',
      });
      blog.image = uploadedImage.url; // Update image URL
    }

    // Save the updated blog post
    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET route to fetch all blogs
router.get('/fetch', async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'No blogs found' });
    }
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE route to remove a blog post by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog post by ID
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Delete the blog post
    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
