// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const ImageKit = require('imagekit');
// const Blog = require('../Models/blogModel');


// const imagekit = new ImageKit({
//   publicKey: "public_snLOVXlg2xzC7+UqSI8i8ZkW488=",
//   privateKey: "private_JIg2ar8TzquKqrG4oSnSUUnNteE=",
//   urlEndpoint: "https://ik.imagekit.io/bq9ym6nknj" 
// });

// // Multer Configuration (memory storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // POST route to create a new blog post with image upload
// router.post('/insert', upload.single('image'), async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     // Ensure title and description are provided
//     if (!title || !description) {
//       return res.status(400).json({ error: 'Title and description are required' });
//     }

//     // Ensure image is provided
//     if (!req.file) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     // Upload image to ImageKit
//     const uploadedImage = await imagekit.upload({
//       file: req.file.buffer,
//       fileName: `${Date.now()}-${req.file.originalname}`,
//       folder: '/blogs',
//     });

//     // Save new blog post to MongoDB
//     const newBlog = new Blog({
//       title,
//       description,
//       image: uploadedImage.url, // Save the ImageKit URL
//     });

//     await newBlog.save();

//     res.status(201).json({ success: true, blog: newBlog });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // PUT route to update an existing blog post (with optional image update)
// router.put('/update/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const { id } = req.params;

//     // Ensure the blog post exists
//     const blog = await Blog.findById(id);
//     if (!blog) return res.status(404).json({ error: 'Blog not found' });

//     // Ensure title and description are provided
//     if (!title || !description) {
//       return res.status(400).json({ error: 'Title and description are required' });
//     }

//     // Update fields
//     blog.title = title || blog.title;
//     blog.description = description || blog.description;

//     // Upload new image if provided
//     if (req.file) {
//       const uploadedImage = await imagekit.upload({
//         file: req.file.buffer,
//         fileName: `${Date.now()}-${req.file.originalname}`,
//         folder: '/blogs',
//       });
//       blog.image = uploadedImage.url; // Update image URL
//     }

//     // Save the updated blog post
//     await blog.save();

//     res.status(200).json({ success: true, blog });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // GET route to fetch all blogs
// router.get('/fetch', async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     if (!blogs || blogs.length === 0) {
//       return res.status(404).json({ success: false, message: 'No blogs found' });
//     }
//     res.status(200).json({ success: true, blogs });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // DELETE route to remove a blog post by ID
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the blog post by ID
//     const blog = await Blog.findById(id);
//     if (!blog) return res.status(404).json({ error: 'Blog not found' });

//     // Delete the blog post
//     await blog.deleteOne();
//     res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const SeoBlog = require('../Models/blogModel');

// Create a new SEO blog
router.post('/addBlog', async (req, res) => {
  try {
    const { mainTitle, description,shortDescription, sections } = req.body;

    console.log("body : ", req.body);

    if (!mainTitle || !description ||!shortDescription || !sections) {
      return res.status(400).json({ error: 'Main title , description,shortDescription and sections are required' });
    }

    const newSeoBlog = new SeoBlog({
      mainTitle,
      description,
      shortDescription,
      sections,
    });

    await newSeoBlog.save();
    res.status(201).json({ success: true, seoBlog: newSeoBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update an existing SEO blog
router.put('/updateBlog/:id', async (req, res) => {
  try {
    const { mainTitle, description, sections } = req.body;
    const { id } = req.params;

    const seoBlog = await SeoBlog.findById(id);
    if (!seoBlog) return res.status(404).json({ error: 'SEO blog not found' });

    seoBlog.mainTitle = mainTitle || seoBlog.mainTitle;
    seoBlog.description = description || seoBlog.description;
    seoBlog.sections = sections || seoBlog.sections;

    await seoBlog.save();
    res.status(200).json({ success: true, seoBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all SEO blogs
router.get('/allBlogs', async (req, res) => {
  try {
    const blogs = await SeoBlog.find();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'No SEO blogs found' });
    }
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch a single SEO blog by ID
router.get('/fetchBolg/:id', async (req, res) => {
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

// Delete an SEO blog
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

