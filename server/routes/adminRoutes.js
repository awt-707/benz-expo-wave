
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

// Auth routes
router.post('/login', adminController.login);

// Protected routes (admin only)
router.post('/upload-video', verifyToken, adminController.uploadVideo);
router.get('/site-config', verifyToken, adminController.getSiteConfig);
router.put('/site-config', verifyToken, adminController.updateSiteConfig);

module.exports = router;
