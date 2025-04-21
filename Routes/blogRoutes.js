const express = require('express');
const multer = require('multer');
const ImageKit = require('imagekit');
const SeoBlog = require('../Models/blogModel');

const router = express.Router();

// ImageKit Configuration
const imagekit = new ImageKit({
  publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
  privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
  urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj"
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/addBlog", upload.single("image"), async (req, res) => {
  try {
    const { mainTitle, shortDescription, description, sections } = req.body;

    const parsedSections = sections ? JSON.parse(sections) : [];

    let imageUrl = null;

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/blog"
      });
      imageUrl = uploadedImage.url;
    }

    const newBlog = new SeoBlog({
      mainTitle,
      shortDescription,
      description,
      sections: parsedSections,
      image: imageUrl
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.log("Add Blog Error:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// ✅ UPDATE blog
router.put('/updateBlog/:id', upload.single('image'), async (req, res) => {
  try {
    const { mainTitle, description, shortDescription, sections } = req.body;
    const { id } = req.params;

    const seoBlog = await SeoBlog.findById(id);
    if (!seoBlog) return res.status(404).json({ error: 'SEO blog not found' });

    seoBlog.mainTitle = mainTitle || seoBlog.mainTitle;
    seoBlog.description = description || seoBlog.description;
    seoBlog.shortDescription = shortDescription || seoBlog.shortDescription;
    seoBlog.sections = sections ? JSON.parse(sections) : seoBlog.sections;

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/blog',
      });
      seoBlog.image = uploadedImage.url;
    }

    await seoBlog.save();
    res.status(200).json({ success: true, seoBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ GET all blogs
router.get('/allBlogs', async (req, res) => {
  try {
    const blogs = await SeoBlog.find();
    if (!blogs.length) return res.status(404).json({ success: false, message: 'No SEO blogs found' });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ GET single blog
router.get('/fetchBlog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await SeoBlog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'SEO blog not found' });
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ DELETE blog
router.delete('/deleteBlog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await SeoBlog.findById(id);
    if (!blog) return res.status(404).json({ error: 'SEO blog not found' });

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'SEO blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
