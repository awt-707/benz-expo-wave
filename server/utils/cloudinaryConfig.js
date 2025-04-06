
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configuration de Cloudinary avec les identifiants
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz12'
});

// Vérifier la configuration
console.log('Cloudinary configuration:');
console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || 'demo');
console.log('- API Key set:', process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No');
console.log('- API Secret set:', process.env.CLOUDINARY_API_SECRET ? 'Yes' : 'No');

module.exports = cloudinary;
