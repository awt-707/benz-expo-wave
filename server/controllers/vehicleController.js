
const Vehicle = require('../models/Vehicle');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/vehicles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter
});

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single vehicle
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Delete associated images
    vehicle.images.forEach(img => {
      const imagePath = path.join(__dirname, '../uploads/vehicles', path.basename(img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload vehicle images
exports.uploadImages = (req, res) => {
  const uploadMultiple = upload.array('images', 10); // Allow up to 10 images

  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const fileUrls = req.files.map(file => `/vehicles/${file.filename}`);
      
      if (req.params.id) {
        // Update existing vehicle with new images
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
        }
        
        vehicle.images = [...vehicle.images, ...fileUrls];
        await vehicle.save();
        return res.status(200).json(vehicle);
      }
      
      // Just return the URLs if no vehicle ID provided
      res.status(200).json(fileUrls);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Get featured vehicles
exports.getFeaturedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ featured: true });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
