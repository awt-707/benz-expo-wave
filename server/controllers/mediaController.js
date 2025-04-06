
const fs = require('fs');
const path = require('path');
const { uploadMedia } = require('../middleware/upload');
const Activity = require('../models/Activity');
const cloudinary = require('../utils/cloudinaryConfig');

// Get all media files
exports.getAllMedia = async (req, res) => {
  try {
    // Récupérer les médias depuis Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'media/',
      max_results: 100
    });
    
    const mediaFiles = result.resources.map(resource => {
      return {
        filename: resource.public_id.split('/').pop(),
        url: resource.secure_url,
        type: path.extname(resource.url).substring(1) || 'jpg',
        size: resource.bytes,
        createdAt: resource.created_at,
        cloudinary_id: resource.public_id
      };
    });
    
    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files from Cloudinary:', error);
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
      console.log('Uploaded media file locally:', req.file);
      const filePath = req.file.path;
      
      // Upload to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
        folder: 'media',
        resource_type: 'auto'
      });
      
      console.log('Uploaded to Cloudinary:', cloudinaryResult);
      
      // Delete local file after upload to Cloudinary
      fs.unlinkSync(filePath);
      
      // Create media file object
      const mediaFile = {
        filename: path.basename(req.file.originalname),
        url: cloudinaryResult.secure_url,
        type: path.extname(req.file.originalname).substring(1) || 'jpg',
        size: cloudinaryResult.bytes,
        createdAt: new Date().toISOString(),
        cloudinary_id: cloudinaryResult.public_id
      };
      
      // Log activity
      try {
        await Activity.create({
          type: 'admin',
          action: 'Nouveau média ajouté',
          details: mediaFile.filename,
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
    
    // Rechercher l'identifiant Cloudinary à partir du nom du fichier
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'media/',
      max_results: 100
    });
    
    const mediaFile = result.resources.find(resource => 
      resource.public_id.split('/').pop() === filename ||
      resource.public_id === `media/${filename}`
    );
    
    if (!mediaFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Supprimer de Cloudinary
    await cloudinary.uploader.destroy(mediaFile.public_id);
    
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
