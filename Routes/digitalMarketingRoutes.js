const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DigitalMarketing = require('../Models/digitalMarketingModel');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const fileName = Date.now() + ext; 
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
  
      const newDigitalMarketing = new DigitalMarketing({
        category: category, 
        images: [
          {
            data: fs.readFileSync(req.file.path), 
            contentType: req.file.mimetype 
          }
        ]
      });
  
      await newDigitalMarketing.save();
  
      resp.status(201).send({
        success: true,
        message: "Digital Marketing created successfully",
        digitalMarketing: newDigitalMarketing,
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
      const allDigitalMarketing = await DigitalMarketing.find();
      
      console.log("Fetched all Digital Marketing:", allDigitalMarketing); 
  
      const formattedDigitalMarketing = allDigitalMarketing.map(digitalMarketing => {
        console.log("Processing Digital Marketing:", digitalMarketing);  
  
        const images = design.images.map(image => {
          const base64Data = image.data ? image.data.toString('base64') : null;
          return {
            data: base64Data,  
            contentType: image.contentType,
          };
        });
  
        return {
          id: digitalMarketing._id,
          category: digitalMarketing.category,
          images: images,  
          createdAt: digitalMarketing.createdAt,
        };
      });
  
      resp.status(200).send({
        success: true,
        message: "Fetched digital marketing successfully",
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
  

  
  
  router.delete('/delete/:id', async (req, resp) => {
    try {
      const { id } = req.params; 
  
      
      const deletedDesign = await Design.findByIdAndDelete(id);
      if (!deletedDesign) {
        return resp.status(404).send({ error: "Design not found" }); 
      }
  
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