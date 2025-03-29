
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const Activity = require('../models/Activity');

// Obtenir tous les médias
exports.getAllMedia = async (req, res) => {
  try {
    console.log('Fetching all media files');
    const mediaDir = path.join(__dirname, '../uploads/media');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
      console.log('Media directory created');
      return res.status(200).json([]);
    }
    
    // Lire le contenu du répertoire
    const files = fs.readdirSync(mediaDir);
    console.log(`Found ${files.length} media files`);
    
    // Construire la liste des médias avec métadonnées
    const mediaFiles = files.map(file => {
      const filePath = path.join(mediaDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        url: `/media/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });
    
    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error in getAllMedia:', error);
    res.status(500).json({ message: error.message });
  }
};

// Télécharger un média
exports.uploadMediaFile = (req, res) => {
  console.log('Uploading media file request received');
  
  const mediaDir = path.join(__dirname, '../uploads/media');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
    console.log('Media directory created');
  }
  
  const uploadSingle = upload.uploadMedia.single('media');
  
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error('Error in uploadMediaFile:', err);
      return res.status(400).json({ message: err.message || String(err) });
    }
    
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }
    
    try {
      const fileUrl = `/media/${req.file.filename}`;
      console.log('File uploaded successfully:', req.file.filename);
      
      // Log activity
      try {
        await Activity.create({
          type: 'media',
          action: 'Média téléchargé',
          details: `${req.file.filename} (${req.file.size} octets)`,
          user: req.user?.username || 'admin'
        });
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }
      
      res.status(200).json({ 
        message: 'Média téléchargé avec succès',
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('Error processing uploaded media:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Supprimer un média
exports.deleteMedia = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('Deleting media file:', filename);
    const filePath = path.join(__dirname, '../uploads/media', filename);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filename);
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    
    fs.unlinkSync(filePath);
    console.log('File deleted successfully:', filename);
    
    // Log activity
    try {
      await Activity.create({
        type: 'media',
        action: 'Média supprimé',
        details: filename,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(200).json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    res.status(500).json({ message: error.message });
  }
};
