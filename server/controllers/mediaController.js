
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');

// Obtenir tous les médias
exports.getAllMedia = async (req, res) => {
  try {
    const mediaDir = path.join(__dirname, '../uploads/media');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
      return res.status(200).json([]);
    }
    
    // Lire le contenu du répertoire
    const files = fs.readdirSync(mediaDir);
    
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
    res.status(500).json({ message: error.message });
  }
};

// Télécharger un média
exports.uploadMediaFile = (req, res) => {
  const uploadSingle = upload.uploadMedia.single('media');
  
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }
    
    try {
      const fileUrl = `/media/${req.file.filename}`;
      res.status(200).json({ 
        message: 'Média téléchargé avec succès',
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Supprimer un média
exports.deleteMedia = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/media', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
