require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows your React app to communicate with this service

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Auth Service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add this near the top with your other requires
const entryRoutes = require('./routes/entries');

// Add this near the bottom with your other routes
app.use('/api/entries', entryRoutes);
// Routes
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth Microservice running on port ${PORT}`));