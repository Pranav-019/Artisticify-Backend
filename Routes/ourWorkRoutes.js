const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OurWork = require('../Models/ourWorkModel');
const Design = require('../Models/design');

// Set up multer storage engine to store images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// POST route to insert data
router.post('/insert', upload.array('images', 10), async (req, resp) => {
  try {
    const { category } = req.body;

    if (!category) {
      return resp.status(400).send({ error: "Category is required" });
    }

    if (!req.files || req.files.length === 0) {
      return resp.status(400).send({ error: "At least one image is required" });
    }

    // Generate URLs for all uploaded images as an array of strings
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    // Create a new "Our Work" entry with the category and image data
    const newOurWork = new OurWork({
      category: category,  // Save the category
      images: imageUrls,   // Array of image URLs (strings)
    });

    // Save the new "Our Work" entry to the database
    await newOurWork.save();

    // Send success response
    resp.status(201).send({
      success: true,
      message: "Our Work item created successfully",
      ourWork: newOurWork,
    });
  } catch (error) {
    console.error("Error during image upload:", error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error in creating Our Work item",
    });
  }
});



// GET route to fetch all data
router.get('/fetch', async (req, resp) => {
  try {
    // Find all entries in the OurWork collection
    const allWorks = await OurWork.find();

    // Send the formatted works in the response
    resp.status(200).send({
      success: true,
      message: "Fetched Our Work items successfully",
      ourWorks: allWorks, // Send the works directly
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    resp.status(500).send({
      success: false,
      message: error,
      error,
    });
  }
});


// PUT route to update an existing item
router.put('/update/:id', upload.array('images', 10), async (req, resp) => {
  try {
    const { category } = req.body;
    const { id } = req.params; // Get the ID of the entry to update

    if (!category) {
      return resp.status(400).send({ error: "Category is required" });
    }

    // Find the existing "Our Work" entry by ID
    const ourWork = await OurWork.findById(id);
    if (!ourWork) {
      return resp.status(404).send({ error: "Our Work item not found" });
    }

    // Update category and images (if new images are provided)
    ourWork.category = category; // Update the category

    if (req.files && req.files.length > 0) {
      // If new files are provided, update the images
      const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      ourWork.images = imageUrls; // Save the new array of image URLs
    }

    // Save the updated "Our Work" entry
    await ourWork.save();

    // Send success response
    resp.status(200).send({
      success: true,
      message: "Our Work item updated successfully",
      ourWork,
    });
  } catch (error) {
    console.error("Error during update:", error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error in updating Our Work item",
    });
  }
});


// DELETE route to remove an item
router.delete('/delete/:id', async (req, resp) => {
  try {
    const { id } = req.params; // Get the ID of the entry to delete

    // Find and delete the "Our Work" entry by ID
    const deletedOurWork = await OurWork.findByIdAndDelete(id);
    if (!deletedOurWork) {
      return resp.status(404).send({ error: "Our Work item not found" });
    }

    // Send success response
    resp.status(200).send({
      success: true,
      message: "Our Work item deleted successfully",
    });
  } catch (error) {
    console.error("Error during deletion:", error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: "Error in deleting Our Work item",
    });
  }
});

module.exports = router;
