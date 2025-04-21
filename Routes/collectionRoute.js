const express = require('express');
const router = express.Router();
const multer = require('multer');
const Collection = require('../Models/collection');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: 'public_snLOVXlg2xzC7+UqSI8i8ZkW488=',
  privateKey: 'private_JIg2ar8TzquKqrG4oSnSUUnNteE=',
  urlEndpoint: 'https://ik.imagekit.io/bq9ym6nknj',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ➤ Create Collection
router.post('/addCollection', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    const newCollection = new Collection({
      image: uploadedImage.url,
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get All Collections
router.get('/fetchCollection', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/updateCollection/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    const collections = await Collection.findById(id);
    if (!collections) return res.status(404).json({ error: 'collections not found' });

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/collections',
      });
      collections.image = uploadedImage.url;
    }

    await collections.save();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// ➤ Delete a Collection
router.delete('/deleteCollection:id', async (req, res) => {
  try {
    const deleted = await Collection.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
