
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const vehicleRoutes = require('./routes/vehicleRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

// Liste des domaines autorisés
const allowedOrigins = [
  'https://immersivedigitaldevelopment.com',
  'https://immersivedigitaldevelopment.fr',
  'https://e47e7d7d-a426-49db-b179-2ca994df7452.lovableproject.com',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:5000'
];

// Add basic security headers
app.use(helmet());

// CORS configuration avec gestion des origins
app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (comme les appels API mobiles)
    if (!origin) return callback(null, true);

    // Vérifie si l'origine est dans la liste des origines autorisées
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `L'origine ${origin} n'est pas autorisée par la politique CORS`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Rate limiting to prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes, veuillez réessayer plus tard."
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : 'undefined');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the application on connection failure
  });

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/vehicles'),
    path.join(__dirname, 'uploads/media'),
    path.join(__dirname, 'uploads/videos'),
    path.join(__dirname, 'uploads/temp')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
};

// Ensure upload directories exist
createUploadDirs();

// Setup static file serving - BEFORE the routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static(path.join(__dirname, 'uploads/media')));
app.use('/vehicles', express.static(path.join(__dirname, 'uploads/vehicles')));
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} from ${req.get('origin') || 'unknown origin'}`);
  next();
});

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/media', mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Dzauto API is running');
});

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
      files: files.slice(0, 20), // Return first 20 files to avoid overwhelming response
      path: vehiclesDir
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
      files: files.slice(0, 20), // Return first 20 files to avoid overwhelming response
      path: mediaDir
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route for contact API
app.get('/api/test-contact', (req, res) => {
  res.json({
    message: "Contact API test route working",
    contactApiEndpoints: [
      { method: "POST", path: "/api/contact", description: "Submit a contact form" },
      { method: "GET", path: "/api/contact", description: "Get all contacts (admin only)" },
      { method: "GET", path: "/api/contact/:id", description: "Get a single contact (admin only)" },
      { method: "PUT", path: "/api/contact/:id/respond", description: "Mark contact as responded (admin only)" },
      { method: "DELETE", path: "/api/contact/:id", description: "Delete a contact (admin only)" }
    ]
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Resource not found' });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connection: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
  console.log(`Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
