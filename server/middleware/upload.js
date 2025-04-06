
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration pour les images de véhicules
const vehicleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/vehicles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Erreur: Images uniquement!'));
  }
};

// Configuration pour les vidéos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/videos';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `site-video-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const videoFileFilter = (req, file, cb) => {
  const filetypes = /mp4|webm|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Erreur: Vidéos uniquement!'));
  }
};

// Configuration pour les médias généraux (utilisé maintenant pour stocker temporairement avant l'upload vers Cloudinary)
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/temp';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Exports
exports.uploadVehicleImages = multer({
  storage: vehicleStorage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: imageFileFilter
});

exports.uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100000000 }, // 100MB
  fileFilter: videoFileFilter
});

exports.uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: imageFileFilter
});
