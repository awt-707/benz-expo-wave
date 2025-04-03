
const fs = require('fs');
const path = require('path');
const { uploadMedia } = require('../middleware/upload');
const Activity = require('../models/Activity');

// Get all media files
exports.getAllMedia = async (req, res) => {
  try {
    const mediaDir = path.join(__dirname, '../uploads/media');
    
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
      return res.status(200).json([]);
    }
    
    const files = fs.readdirSync(mediaDir);
    
    const mediaFiles = files.map(file => {
      const filePath = path.join(mediaDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        url: `/media/${file}`,
        type: path.extname(file).substring(1),
        size: stats.size,
        createdAt: stats.mtime.toISOString()
      };
    });
    
    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload a new media file
exports.uploadMediaFile = (req, res) => {
  uploadMedia.single('media')(req, res, async (err) => {
    if (err) {
      console.error('Error uploading media:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      console.log('Uploaded media file:', req.file);
      
      // Create media file object
      const mediaFile = {
        filename: req.file.filename,
        url: `/media/${req.file.filename}`,
        type: path.extname(req.file.filename).substring(1),
        size: req.file.size,
        createdAt: new Date().toISOString()
      };
      
      // Log activity
      try {
        await Activity.create({
          type: 'admin',
          action: 'Nouveau média ajouté',
          details: req.file.filename,
          user: req.user?.username || 'admin'
        });
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }
      
      res.status(201).json(mediaFile);
    } catch (error) {
      console.error('Error processing uploaded media:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete a media file
exports.deleteMedia = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/media', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    
    // Log activity
    try {
      await Activity.create({
        type: 'admin',
        action: 'Média supprimé',
        details: filename,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ message: error.message });
  }
};
