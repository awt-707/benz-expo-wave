
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const vehicleRoutes = require('./routes/vehicleRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Ensure upload directories exist
const createDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/vehicles'),
  path.join(__dirname, 'uploads/media'),
  path.join(__dirname, 'uploads/videos')
];

createDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/media', mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('3ansdz API is running');
});

// Serve uploaded files
console.log('Setting up static file serving...');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static(path.join(__dirname, 'uploads/media')));
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/vehicles', express.static(path.join(__dirname, 'uploads/vehicles')));

// Debug routes
app.get('/api/check-uploads', (req, res) => {
  const vehiclesDir = path.join(__dirname, 'uploads/vehicles');
  
  if (!fs.existsSync(vehiclesDir)) {
    return res.json({ exists: false, message: 'Vehicles directory does not exist' });
  }
  
  try {
    const files = fs.readdirSync(vehiclesDir);
    res.json({ 
      exists: true, 
      fileCount: files.length,
      files: files.slice(0, 20) // Return first 20 files to avoid overwhelming response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-media', (req, res) => {
  const mediaDir = path.join(__dirname, 'uploads/media');
  
  if (!fs.existsSync(mediaDir)) {
    return res.json({ exists: false, message: 'Media directory does not exist' });
  }
  
  try {
    const files = fs.readdirSync(mediaDir);
    res.json({ 
      exists: true, 
      fileCount: files.length,
      files: files.slice(0, 20) // Return first 20 files to avoid overwhelming response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Ressource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`Media URL prefix: ${API_BASE_URL}/media`);
  console.log(`Vehicles URL prefix: ${API_BASE_URL}/vehicles`);
});

module.exports = app;
