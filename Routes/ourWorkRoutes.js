const express = require('express');
const router = express.Router();
const Ourwork = require('../Models/ourWorkModel');

// Insert images (via Drive links)
router.post('/insert', async (req, res) => {
  const { category, subCategory, imageUrls } = req.body;

  if (!imageUrls || imageUrls.length === 0) {
    return res.status(400).json({ message: 'No Drive links provided.' });
  }

  let finalImageUrls = Array.isArray(imageUrls) ? imageUrls : imageUrls.split(',').map(url => url.trim());

  // Check for valid category
  const validCategories = ['logo', 'brochure', 'poster', 'flyer', 'packaging', 'ui/ux', 'icon', 'magazine', 'visual aid', 'stationary'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category provided.' });
  }

  // Set subCategory to "" for all categories, including "stationary"
  const finalSubCategory = subCategory || "";

  try {
    let existingWork = await Ourwork.findOne({ category });

    if (existingWork) {
      // Update the existing category
      existingWork.imageUrls = existingWork.imageUrls.concat(finalImageUrls);
      existingWork.subCategory = finalSubCategory;  // Ensure subCategory is always an empty string
      await existingWork.save();
      return res.status(200).json({ message: 'Drive links updated successfully', updatedWork: existingWork });
    } else {
      // Create a new category entry
      const newWork = new Ourwork({
        category,
        subCategory: finalSubCategory,  // Use empty string or provided subCategory
        imageUrls: finalImageUrls
      });

      await newWork.save();
      return res.status(200).json({ message: 'Drive links inserted successfully', newWork });
    }
  } catch (error) {
    console.error('Error inserting drive links:', error);
    res.status(500).json({ message: 'Error inserting Drive links', error: error.message });
  }
});
// Update images (via Drive links)
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { category, subCategory, imageUrls } = req.body;

  if (!imageUrls || imageUrls.length === 0) {
    return res.status(400).json({ message: 'No Drive links provided.' });
  }

  // Ensure imageUrls is an array, split if it's a string
  let finalImageUrls = Array.isArray(imageUrls) ? imageUrls : imageUrls.split(',').map(url => url.trim());

  try {
    const updatedWork = await Ourwork.findByIdAndUpdate(
      id,
      { category, subCategory, imageUrls: finalImageUrls },
      { new: true }
    );

    if (!updatedWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json({ message: 'Drive links updated successfully', updatedWork });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Drive links', error });
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
