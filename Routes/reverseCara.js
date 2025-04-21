const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const ReverseCara = require('../Models/reverseCaraModel');

// ✅ ImageKit config
const imagekit = new ImageKit({
  publicKey: 'public_snLOVXlg2xzC7+UqSI8i8ZkW488=', 
  privateKey: 'private_JIg2ar8TzquKqrG4oSnSUUnNteE=',
  urlEndpoint: 'https://ik.imagekit.io/bq9ym6nknj',
});

// ✅ Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Add an Image (Only image)
router.post('/addReverseCara', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/reverseCara',
    });

    const newReverseCara = new ReverseCara({
      image: uploadedImage.url,
    });

    await newReverseCara.save();

    res.status(201).json({
      success: true,
      message: 'Image added to ReverseCara successfully',
      imageUrl: uploadedImage.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update Image
router.put('/updateReverseCara/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    const imageDoc = await ReverseCara.findById(id);
    if (!imageDoc) return res.status(404).json({ error: 'Image not found' });

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/reverseCara',
      });
      imageDoc.image = uploadedImage.url;
    }

    await imageDoc.save();
    res.status(200).json({ success: true, imageDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get All Images
router.get('/fetchReverseCara', async (req, res) => {
  try {
    const images = await ReverseCara.find();
    if (!images || images.length === 0) {
      return res.status(404).json({ success: false, message: 'No images found' });
    }
    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete Image
router.delete('/deleteReverseCara/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const imageDoc = await ReverseCara.findById(id);
    if (!imageDoc) return res.status(404).json({ error: 'Image not found' });

    await imageDoc.deleteOne();
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
