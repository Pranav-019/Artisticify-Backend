require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config');
const packageRoutes = require('./Routes/packageRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const userRoutes = require('./Routes/userRoutes');
const ourworkRoutes = require('./Routes/ourWorkRoutes');
const newsletterRoute = require('./Routes/newsletterRoute');
const path = require('path');
const designRoutes = require('./Routes/designRoutes')
const socialLinks = require('./Routes/socialLinksroutes')
const counterRoutes = require('./Routes/counterRoutes');
const blogRoutes = require('./Routes/blogRoutes'); 
const testimonialRoutes = require("./Routes/testimonialRoutes");
const cardRoutes = require("./Routes/cardRoute");
const reverseCaraRoutes = require('./Routes/reverseCara');
// Connect to MongoDB
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/packages', packageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/ourwork', ourworkRoutes);
app.use('/api/newsletter', newsletterRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/design/', designRoutes);
app.use('/api/social', socialLinks);
app.use('/api/counter', counterRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use('/api/reverseCara', reverseCaraRoutes);
app.use("/api/cards", cardRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
