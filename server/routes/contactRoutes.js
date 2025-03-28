
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/', contactController.submitContact);

// Admin routes (protected)
router.get('/', verifyToken, contactController.getContacts);
router.get('/:id', verifyToken, contactController.getContact);
router.put('/:id/respond', verifyToken, contactController.markResponded);
router.delete('/:id', verifyToken, contactController.deleteContact);

module.exports = router;
