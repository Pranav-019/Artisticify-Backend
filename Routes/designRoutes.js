const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
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
      const { category } = req.body;
      if (!category) {
        return resp.status(400).send({ error: "Category is required" }); 
      }
  
      if (!req.file) {
        return resp.status(400).send({ error: "Image is required" }); 
      }
  
      const newDesign = new Design({
        category: category, 
        images: [
          {
            data: fs.readFileSync(req.file.path), 
            contentType: req.file.mimetype 
          }
        ]
      });
  
      await newDesign.save();
  
      resp.status(201).send({
        success: true,
        message: "Design created successfully",
        design: newDesign,
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
      const allDesign = await Design.find();
      
      console.log("Fetched all works:", allDesign); 
  
      const formattedDesign = allDesign.map(design => {
        console.log("Processing design:", design);  
  
        const images = design.images.map(image => {
          const base64Data = image.data ? image.data.toString('base64') : null;
          return {
            data: base64Data,  
            contentType: image.contentType,
          };
        });
  
        return {
          id: design._id,
          category: design.category,
          images: images,  // Return images data
          createdAt: design.createdAt,
        };
      });
  
      // Send the formatted works in the response
      resp.status(200).send({
        success: true,
        message: "Fetched design successfully",
        ourDesign: formattedDesign,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      resp.status(500).send({
        success: false,
        message: "Error in fetching Design",
        error,
      });
    }
  });
  
//   router.put('/update/:id', upload.single('imageUrls'), async (req, resp) => {
//     try {
//       const { category } = req.body;
//       const { id } = req.params; // Get the ID of the entry to update
  
//       if (!category) {
//         return resp.status(400).send({ error: "Category is required" }); // Bad request if no category provided
//       }
  
//       // Find the existing "Our Work" entry by ID
//       const ourWork = await OurWork.findById(id);
//       if (!ourWork) {
//         return resp.status(404).send({ error: "Our Work item not found" }); // Not found if the item doesn't exist
//       }
  
//       // Update category and image (if new image is provided)
//       ourWork.category = category; // Update the category
  
//       if (req.file) {
//         // If a new file is provided, update the image
//         ourWork.images = [
//           {
//             data: fs.readFileSync(req.file.path),
//             contentType: req.file.mimetype
//           }
//         ];
//       }
  
//       // Save the updated "Our Work" entry
//       await ourWork.save();
  
//       // Send success response
//       resp.status(200).send({
//         success: true,
//         message: "Our Work item updated successfully",
//         ourWork,
//       });
//     } catch (error) {
//       console.error("Error during update:", error);
//       resp.status(500).send({
//         success: false,
//         error: error.message || error,
//         message: "Error in updating Our Work item",
//       });
//     }
//   });
  
  
  router.delete('/delete/:id', async (req, resp) => {
    try {
      const { id } = req.params; // Get the ID of the entry to delete
  
      // Find and delete the "Our Work" entry by ID
      const deletedDesign = await Design.findByIdAndDelete(id);
      if (!deletedDesign) {
        return resp.status(404).send({ error: "Design not found" }); // Not found if the item doesn't exist
      }
  
      // Send success response
      resp.status(200).send({
        success: true,
        message: "Design deleted successfully",
      });
    } catch (error) {
      console.error("Error during deletion:", error);
      resp.status(500).send({
        success: false,
        error: error.message || error,
        message: "Error in deleting Delete",
      });
    }
  });
  
  
  module.exports = router;