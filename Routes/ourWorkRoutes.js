const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const Ourwork = require('../Models/ourWorkModel');
const OurWork = require('../Models/ourWorkModel');
const Design = require('../Models/design');

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


router.post('/insert', upload.single('imageUrls'), async (req, resp) => {
  try {
    // Check if category is provided in the request body
    const { category } = req.body;
    if (!category) {
      return resp.status(400).send({ error: "Category is required" }); // Bad request if no category provided
    }

    // Check if the file is present
    if (!req.file) {
      return resp.status(400).send({ error: "Image is required" }); // Bad request if no file uploaded
    }

    // Create a new "Our Work" entry with the category and image data
    const newOurWork = new OurWork({
      category: category, // Save the category
      images: [
        {
          data: fs.readFileSync(req.file.path), // Read the file content as binary data
          contentType: req.file.mimetype // Save the file's MIME type
        }
      ]
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




router.get('/fetch', async (req, resp) => {
  try {
    // Find all entries in the OurWork collection
    const allWorks = await OurWork.find();
    
    // Check if data is fetched properly
    console.log("Fetched all works:", allWorks);  // Debugging line

    // Map through the results to prepare image data for the response
    const formattedWorks = allWorks.map(work => {
      console.log("Processing work:", work);  // Debugging line

      // Process the images field
      const images = work.images.map(image => {
        // Ensure that image.data is a buffer and convert it to Base64
        const base64Data = image.data ? image.data.toString('base64') : null;
        return {
          data: base64Data,  // Convert binary data to base64
          contentType: image.contentType,
        };
      });

      return {
        id: work._id,
        category: work.category,
        images: images,  // Return images data
        createdAt: work.createdAt,
      };
    });

    // Send the formatted works in the response
    resp.status(200).send({
      success: true,
      message: "Fetched Our Work items successfully",
      ourWorks: formattedWorks,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    resp.status(500).send({
      success: false,
      message: "Error in fetching Our Work items",
      error,
    });
  }
});

router.put('/update/:id', upload.single('imageUrls'), async (req, resp) => {
  try {
    const { category } = req.body;
    const { id } = req.params; // Get the ID of the entry to update

    if (!category) {
      return resp.status(400).send({ error: "Category is required" }); // Bad request if no category provided
    }

    // Find the existing "Our Work" entry by ID
    const ourWork = await OurWork.findById(id);
    if (!ourWork) {
      return resp.status(404).send({ error: "Our Work item not found" }); // Not found if the item doesn't exist
    }

    // Update category and image (if new image is provided)
    ourWork.category = category; // Update the category

    if (req.file) {
      // If a new file is provided, update the image
      ourWork.images = [
        {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype
        }
      ];
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


router.delete('/delete/:id', async (req, resp) => {
  try {
    const { id } = req.params; // Get the ID of the entry to delete

    // Find and delete the "Our Work" entry by ID
    const deletedOurWork = await OurWork.findByIdAndDelete(id);
    if (!deletedOurWork) {
      return resp.status(404).send({ error: "Our Work item not found" }); // Not found if the item doesn't exist
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
