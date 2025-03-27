
const jwt = require('jsonwebtoken');
const SiteConfig = require('../models/SiteConfig');
const Activity = require('../models/Activity');
const Vehicle = require('../models/Vehicle');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
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
    
    // Log activity
    try {
      await Activity.create({
        type: 'admin',
        action: 'Connexion',
        details: username,
        user: username
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
    
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
      
      // Log activity
      await Activity.create({
        type: 'admin',
        action: 'Modification vidéo',
        details: `Nouvelle vidéo : ${req.file.filename}`,
        user: req.user.username
      });
      
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
    if (req.body.seo) siteConfig.seo = req.body.seo;
    if (req.body.videoUrl) siteConfig.videoUrl = req.body.videoUrl;
    
    siteConfig.lastUpdated = Date.now();
    await siteConfig.save();
    
    // Log activity
    await Activity.create({
      type: 'admin',
      action: 'Modification configuration',
      details: 'Mise à jour des paramètres du site',
      user: req.user.username
    });
    
    res.status(200).json(siteConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update custom page
exports.updateCustomPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { title, content } = req.body;
    
    if (!pageKey || !title || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
    }
    
    // Initialize customPages if it doesn't exist
    if (!siteConfig.customPages) {
      siteConfig.customPages = {};
    }
    
    // Update the page data
    siteConfig.customPages[pageKey] = {
      title,
      content,
      lastUpdated: new Date()
    };
    
    await siteConfig.save();
    
    // Log activity
    await Activity.create({
      type: 'admin',
      action: 'Modification page',
      details: `Page "${title}" mise à jour`,
      user: req.user.username
    });
    
    res.status(200).json({ message: 'Page updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts for each model
    const vehicleCount = await Vehicle.countDocuments();
    const messageCount = await Contact.countDocuments();
    const unreadMessageCount = await Contact.countDocuments({ isRead: false });
    
    // Get visitor stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const visitorToday = await Visitor.countDocuments({ 
      timestamp: { $gte: today } 
    });
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    lastWeek.setHours(0, 0, 0, 0);
    
    const visitorWeek = await Visitor.countDocuments({ 
      timestamp: { $gte: lastWeek } 
    });
    
    // Get recent activities
    const recentActivities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(5);
    
    res.status(200).json({
      counts: {
        vehicles: vehicleCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
        visitorsToday: visitorToday,
        visitorsWeek: visitorWeek
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activity log
exports.getActivityLog = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
