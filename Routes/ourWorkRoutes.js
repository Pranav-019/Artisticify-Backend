const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const OurWork = require('../Models/ourWorkModel');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey 
:
 
"public_snLOVXlg2xzC7+UqSI8i8ZkW488="
,

    privateKey 
:
 
"private_JIg2ar8TzquKqrG4oSnSUUnNteE="
,

    urlEndpoint 
:
 
"https://ik.imagekit.io/bq9ym6nknj" // Replace with your ImageKit URL endpoint
});

// Set up multer storage (temporary memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to insert data
router.post('/insert', upload.array('images', 10), async (req, resp) => {
  try {
    const { category } = req.body;

    if (!category) {
      return resp.status(400).send({ error: 'Category is required' });
    }

    if (!req.files || req.files.length === 0) {
      return resp.status(400).send({ error: 'At least one image is required' });
    }

    // Upload images to ImageKit
    const imageUploadPromises = req.files.map((file) =>
      imagekit.upload({
        file: file.buffer, // File buffer
        fileName: `${Date.now()}-${file.originalname}`, // Unique filename
        folder: '/our-work', // Optional: Specify a folder in ImageKit
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Extract URLs of uploaded images
    const imageUrls = uploadedImages.map((image) => image.url);

    // Create a new "Our Work" entry
    const newOurWork = new OurWork({
      category,
      images: imageUrls, // Save the image URLs
    });

    await newOurWork.save();

    // Send success response
    resp.status(201).send({
      success: true,
      message: 'Our Work item created successfully',
      ourWork: newOurWork,
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: 'Error in creating Our Work item',
    });
  }
});

// PUT route to update an existing item
router.put('/update/:id', upload.array('images', 10), async (req, resp) => {
  try {
    const { category } = req.body;
    const { id } = req.params;

    if (!category) {
      return resp.status(400).send({ error: 'Category is required' });
    }

    const ourWork = await OurWork.findById(id);
    if (!ourWork) {
      return resp.status(404).send({ error: 'Our Work item not found' });
    }

    ourWork.category = category;

    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: '/our-work',
        })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      const imageUrls = uploadedImages.map((image) => image.url);

      ourWork.images = imageUrls;
    }

    await ourWork.save();

    resp.status(200).send({
      success: true,
      message: 'Our Work item updated successfully',
      ourWork,
    });
  } catch (error) {
    console.error('Error during update:', error);
    resp.status(500).send({
      success: false,
      error: error.message || error,
      message: 'Error in updating Our Work item',
    });
  }
});

module.exports = router;
