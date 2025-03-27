
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { verifyToken } = require('../middleware/auth');

// Routes protégées (admin uniquement)
router.get('/', verifyToken, mediaController.getAllMedia);
router.post('/upload', verifyToken, mediaController.uploadMediaFile);
router.delete('/:filename', verifyToken, mediaController.deleteMedia);

module.exports = router;
