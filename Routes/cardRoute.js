// routes/cards.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const Card = require('../Models/card');

// ✅ ImageKit config
const imagekit = new ImageKit({
  publicKey: 'public_snLOVXlg2xzC7+UqSI8i8ZkW488=',
  privateKey: 'private_JIg2ar8TzquKqrG4oSnSUUnNteE=',
  urlEndpoint: 'https://ik.imagekit.io/bq9ym6nknj',
});

// ✅ Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Add a Card (Only image)
router.post('/addCard', upload.single('image'), async (req, res) => {
  try {
    // Ensure that an image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // ImageKit upload logic
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/cards',
    });

    // Create a new card document
    const newCard = new Card({
      image: uploadedImage.url,
    });

    await newCard.save();

    // Respond with the uploaded image URL
    res.status(201).json({
      success: true,
      message: 'Card added successfully',
      imageUrl: uploadedImage.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update Card
router.put('/updateCard/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/cards',
      });
      card.image = uploadedImage.url;
    }

    await card.save();
    res.status(200).json({ success: true, card });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get All Cards
router.get('/fetchCards', async (req, res) => {
  try {
    const cards = await Card.find();
    if (!cards || cards.length === 0) {
      return res.status(404).json({ success: false, message: 'No cards found' });
    }
    res.status(200).json({ success: true, cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete Card
router.delete('/deleteCard/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    await card.deleteOne();
    res.status(200).json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
