const express = require('express');
const router = express.Router();
const Package = require('../Models/packageModel');

// Get all packages
router.get('/', async (req, res) => {
  try {
    // Filter packages based on query parameters (e.g., isActive, type, category)
    const { isActive, type, category } = req.query;

    const query = {};
    if (isActive) query.isActive = isActive === 'true';
    if (type) query.type = type;
    if (category) query.category = category;

    const packages = await Package.find(query);
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'An error occurred while fetching packages.' });
  }
});

// Add a new package (admin feature)
router.post('/', async (req, res) => {
  try {
    const { name, type, category, price, features, isActive, colorCode } = req.body;

    // Validation for required fields
    if (!name || !type || !category || !price || !features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({ error: 'Name, type, category, price, and features (non-empty array) are required.' });
    }

    // Ensure valid package type
    if (!['Basic', 'Standard', 'Premium'].includes(type)) {
      return res.status(400).json({ error: 'Invalid package type. Valid types are Basic, Standard, Premium.' });
    }

    // Create a new package document
    const newPackage = new Package({ name, type, category, price, features, isActive, colorCode });
    const savedPackage = await newPackage.save();

    res.status(201).json({ message: 'Package added successfully.', package: savedPackage });
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(400).json({ error: 'An error occurred while adding the package.' });
  }
});

// Update an existing package (admin feature)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, category, price, features, isActive, colorCode } = req.body;

    // Validate package type if provided
    if (type && !['Basic', 'Standard', 'Premium'].includes(type)) {
      return res.status(400).json({ error: 'Invalid package type. Valid types are Basic, Standard, Premium.' });
    }

    // Find and update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { name, type, category, price, features, isActive, colorCode },
      { new: true, runValidators: true } // Return the updated document and validate changes
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found.' });
    }

    res.status(200).json({ message: 'Package updated successfully.', package: updatedPackage });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(400).json({ error: 'An error occurred while updating the package.' });
  }
});

// Delete a package (admin feature)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package not found.' });
    }

    res.status(200).json({ message: 'Package deleted successfully.', package: deletedPackage });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(400).json({ error: 'An error occurred while deleting the package.' });
  }
});

module.exports = router;

