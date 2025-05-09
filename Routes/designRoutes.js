const express = require('express');
const multer = require('multer');
const router = express.Router();
const Design = require('../Models/designModel');
const ImageKit = require('imagekit');

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
  privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
  urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj",
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload images and create a design
router.post('/insert', upload.array('images', 10), async (req, res) => {
  try {
    const { category } = req.body;
    const imageFiles = req.files;

    if (!category || !imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ error: 'Category and images are required.' });
    }

    // Upload images to ImageKit
    const uploadPromises = imageFiles.map((file) =>
      imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      })
    );

    const uploadResponses = await Promise.all(uploadPromises);

    // Extract URLs from upload responses
    const imageUrls = uploadResponses.map((upload) => upload.url);

    // Save design to MongoDB
    const design = new Design({ category, images: imageUrls });
    await design.save();

    res.status(201).json({ message: 'Design created successfully!', design });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create design.' });
  }
});

// GET route to fetch all designs
router.get('/get', async (req, res) => {
  try {
    const designs = await Design.find();
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch designs.' });
  }
});

// DELETE route to delete a design by ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the design by ID
      const design = await Design.findById(id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found.' });
      }
      
      // Delete the design from MongoDB
      await Design.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Design deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete design.' });
    }
  });
  

module.exports = router;
