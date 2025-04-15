const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const Testimonial = require('../Models/testimonial');

// ImageKit configuration
const imagekit = new ImageKit({
    publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
    privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
    urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj" // Replace with your ImageKit URL endpoint
  });

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create a new testimonial (POST)
router.post('/insert', upload.single('image'), async (req, res) => {
  try {
    const { name, position, text, rating } = req.body;

    if (!name || !position || !text || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/testimonials',
    });

    const newTestimonial = new Testimonial({
      name,
      position,
      text,
      rating,
      image: uploadedImage.url,
    });

    await newTestimonial.save();
    res.status(201).json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update a testimonial (PUT)
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, position, text, rating } = req.body;
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });

    testimonial.name = name || testimonial.name;
    testimonial.position = position || testimonial.position;
    testimonial.text = text || testimonial.text;
    testimonial.rating = rating || testimonial.rating;

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/testimonials',
      });
      testimonial.image = uploadedImage.url;
    }

    await testimonial.save();
    res.status(200).json({ success: true, testimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get all testimonials (GET)
router.get('/fetch', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({ success: false, message: 'No testimonials found' });
    }
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete testimonial (DELETE)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });

    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
