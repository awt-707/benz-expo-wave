
const jwt = require('jsonwebtoken');
const SiteConfig = require('../models/SiteConfig');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Admin login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials against environment variables
  if (
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Set up storage for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/videos';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `site-video${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /mp4|webm|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Videos only!');
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100000000 }, // 100MB
  fileFilter
});

// Upload site video
exports.uploadVideo = (req, res) => {
  const uploadVideo = upload.single('video');

  uploadVideo(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      // Save video URL to site config
      let siteConfig = await SiteConfig.findOne();
      
      if (!siteConfig) {
        siteConfig = new SiteConfig();
      }
      
      siteConfig.videoUrl = `/videos/${req.file.filename}`;
      await siteConfig.save();
      
      res.status(200).json({ 
        message: 'Video uploaded successfully',
        videoUrl: siteConfig.videoUrl 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Get site config
exports.getSiteConfig = async (req, res) => {
  try {
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
      await siteConfig.save();
    }
    
    res.status(200).json(siteConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update site config
exports.updateSiteConfig = async (req, res) => {
  try {
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
    }
    
    // Update fields
    if (req.body.homeHeroText) siteConfig.homeHeroText = req.body.homeHeroText;
    if (req.body.contactInfo) siteConfig.contactInfo = req.body.contactInfo;
    if (req.body.socialMedia) siteConfig.socialMedia = req.body.socialMedia;
    
    siteConfig.lastUpdated = Date.now();
    await siteConfig.save();
    
    res.status(200).json(siteConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
