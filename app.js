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




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
