const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes'); // Import the ad routes
const Ad = require('./models/Ad'); // Import the Ad model
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes


const cloudinary = require('./config/cloudinary');

require('dotenv').config();

connectDB();
const app = express();
const path = require('path');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Only allow your Vite frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rest of your middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes after middleware
app.use('/api/users', userRoutes); // Routes for user profile and ads
app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes); // Routes for ads
app.use('/api/upload', uploadRoutes); // Routes for image uploads
app.use('/api/messages', messageRoutes); // Routes for messages
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(5000, () => console.log('Server running on port 5000'));
