const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OurWork = require('../Models/ourWorkModel'); // Import the model

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (JPEG, JPG, PNG, GIF)'));
    }
  },
});

// Add an image (with file upload)
router.post('/add', upload.single('image'), async (req, res) => {
  const { category, subCategory } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Relative path to the uploaded file
    let categoryDoc = await OurWork.findOne({ name: category });

    if (!categoryDoc) {
      categoryDoc = new OurWork({ name: category });
    }

    if (category === 'Stationary' && subCategory) {
      let subCat = categoryDoc.subCategories.find(sub => sub.name === subCategory);
      if (!subCat) {
        subCat = { name: subCategory, images: [] };
        categoryDoc.subCategories.push(subCat);
      }
      subCat.images.push(imageUrl);
    } else if (category !== 'Stationary') {
      if (!categoryDoc.images) categoryDoc.images = [];
      categoryDoc.images.push(imageUrl);
    } else {
      return res.status(400).json({ error: 'Subcategory is required for Stationary' });
    }

    await categoryDoc.save();
    res.status(200).json({ message: 'Image added successfully', categoryDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error adding image',
      details: error.message,
      stack: error.stack,
    });
  }
});

// Fetch all images under a specific category (and optionally subcategory)
// GET images by category (and optional subcategory)
router.get('/images', async (req, res) => {
    const { category, subCategory } = req.query;
  
    try {
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }
  
      let categoryDoc = await OurWork.findOne({ name: category });
  
      if (!categoryDoc) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      if (subCategory) {
        const subCat = categoryDoc.subCategories.find(sub => sub.name === subCategory);
        if (!subCat) {
          return res.status(404).json({ error: 'Subcategory not found' });
        }
        return res.status(200).json({ images: subCat.images });
      } else {
        return res.status(200).json({ images: categoryDoc.images });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching images', details: error.message });
    }
  });
  
module.exports = router;
