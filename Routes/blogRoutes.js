const multer = require('multer');
const ImageKit = require('imagekit');
const express = require('express');
const router = express.Router();
const SeoBlog = require('../Models/blogModel');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
  privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
  urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj"
});

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Storing file in memory
const upload = multer({ storage: storage });

// Create a new SEO blog
router.post('/addBlog',upload.single('image'), async (req, res) => {
  try {
    const { mainTitle, description,shortDescription, sections } = req.body;

    console.log("body : ", req.body);

    if (!mainTitle || !description ||!shortDescription || !sections) {
      return res.status(400).json({ error: 'Main title , description,shortDescription and sections are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/uploads',
    });

    const newSeoBlog = new SeoBlog({
      mainTitle,
      description,
      shortDescription,
      sections,
      image: uploadedImage.url,
    });

      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
      console.error("Add Blog Error:", error);
      res.status(500).json({ message: "Server error while creating blog" });
    }
});

// Update an existing SEO blog
router.put('/updateBlog/:id', upload.single('image'), async (req, res) => {
  try {
    const { mainTitle, description, shortDescription, sections } = req.body;
    const { id } = req.params;

    const seoBlog = await SeoBlog.findById(id);
    if (!seoBlog) return res.status(404).json({ error: 'SEO blog not found' });

    seoBlog.mainTitle = mainTitle || seoBlog.mainTitle;
    seoBlog.description = description || seoBlog.description;
    seoBlog.shortDescription = shortDescription || seoBlog.shortDescription;
    seoBlog.sections = sections || seoBlog.sections;

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/blog',
      });
      seoBlog.image = uploadedImage.url;
    }

    await seoBlog.save();
    res.status(200).json({ success: true, seoBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all SEO blogs
router.get('/allBlogs', async (req, res) => {
  try {
    const blogs = await SeoBlog.find();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'No SEO blogs found' });
    }
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch a single SEO blog by ID
router.get('/fetchBlog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await SeoBlog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'SEO blog not found' });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an SEO blog
router.delete('/deleteBlog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await SeoBlog.findById(id);
    if (!blog) return res.status(404).json({ error: 'SEO blog not found' });

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'SEO blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
