const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const Design = require('../Models/designModel');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=", // Your ImageKit public key
  privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=", // Your ImageKit private key
  urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj" // Your ImageKit URL endpoint
});

// Set up multer storage (temporary memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to insert design data
router.post('/insert', upload.array('images', 10), async (req, resp) => {
  try {
    const { category } = req.body;

    if (!category) {
      return resp.status(400).send({ error: 'Category is required' });
    }

    if (!req.files || req.files.length === 0) {
      return resp.status(400).send({ error: 'At least one image is required' });
    }

    // Log the uploaded files
    console.log('Uploaded files:', req.files);

    // Upload images to ImageKit
    const imageUploadPromises = req.files.map((file) =>
      imagekit.upload({
        file: file.buffer, // File buffer
        fileName: `${Date.now()}-${file.originalname}`, // Unique filename
        folder: '/designs', // Optional: Specify a folder in ImageKit
      })
    );

    // Wait for all images to be uploaded
    const uploadedImages = await Promise.all(imageUploadPromises);

    // Log the uploaded images
    console.log('Uploaded images:', uploadedImages);

    // Extract URLs of uploaded images
    const imageUrls = uploadedImages.map((image) => image.url);

    // Create a new "Design" entry
    const newDesign = new Design({
      category,
      image: imageUrls, // Save the image URLs as an array
    });

    // Save the new design item to the database
    await newDesign.save();

    // Send success response
    resp.status(201).send({
      success: true,
      message: 'Design item created successfully',
      design: newDesign,
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: 'Error in creating Design item',
    });
  }
});

module.exports = router;
