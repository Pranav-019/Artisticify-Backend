const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Ourwork = require('../Models/ourWorkModel');

// Set up multer storage engine to store images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const fileName = Date.now() + ext; // Use timestamp as filename
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Insert images (via URL or file upload)
router.post('/insert', upload.any(), async (req, res) => {
    const { category, subCategory, imageUrls } = req.body;
    let finalImageUrls = [];
  
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      finalImageUrls = req.files.map(file => `/uploads/${file.filename}`); // Store local path for each uploaded image
    }
  
    // Handle image URLs if provided
    if (imageUrls && imageUrls.length > 0) {
      finalImageUrls = finalImageUrls.concat(imageUrls.split(',')); // Concatenate image URLs
    }
  
    // If no images or URLs are provided
    if (finalImageUrls.length === 0) {
      return res.status(400).json({ message: 'No images or URLs provided.' });
    }
  
    try {
      // Check if the category already exists in the database
      let existingWork = await Ourwork.findOne({ category });
  
      if (existingWork) {
        // If the category exists, update the existing work with new images
        existingWork.imageUrls = existingWork.imageUrls.concat(finalImageUrls);  // Add new image URLs to existing ones
        existingWork.subCategory = subCategory || existingWork.subCategory;  // Update subCategory if provided
        await existingWork.save();
        return res.status(200).json({ message: 'Images updated successfully', updatedWork: existingWork });
      } else {
        // If no work exists, create a new one
        const newWork = new Ourwork({
          category, 
          subCategory,
          imageUrls: finalImageUrls
        });
        await newWork.save();
        res.status(201).json({ message: 'Images inserted successfully', newWork });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error inserting images', error });
    }
  });
  

// Update images (via URL or file upload)
router.put('/update/:id', upload.any(), async (req, res) => {
  const { id } = req.params;
  const { category, subCategory, imageUrls } = req.body;
  let finalImageUrls = [];

  // Handle uploaded files
  if (req.files && req.files.length > 0) {
    finalImageUrls = req.files.map(file => `/uploads/${file.filename}`); // Store local path for each uploaded image
  }

  // Handle image URLs if provided
  if (imageUrls && imageUrls.length > 0) {
    finalImageUrls = finalImageUrls.concat(imageUrls.split(',')); // Concatenate image URLs
  }

  // If no images or URLs are provided
  if (finalImageUrls.length === 0) {
    return res.status(400).json({ message: 'No images or URLs provided.' });
  }

  try {
    const updatedWork = await Ourwork.findByIdAndUpdate(
      id,
      { category, subCategory, imageUrls: finalImageUrls },
      { new: true }
    );

    if (!updatedWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json({ message: 'Images updated successfully', updatedWork });
  } catch (error) {
    res.status(500).json({ message: 'Error updating images', error });
  }
});

// Delete image(s)
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWork = await Ourwork.findByIdAndDelete(id);

    if (!deletedWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json({ message: 'Work deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting work', error });
  }
});

// Get all works
router.get('/get', async (req, res) => {
  try {
    const works = await Ourwork.find().populate('category'); // Populate category details if needed
    res.status(200).json({ message: 'Works retrieved successfully', works });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving works', error });
  }
});

module.exports = router;
