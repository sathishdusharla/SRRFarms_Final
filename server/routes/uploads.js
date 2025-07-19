// Server route to serve uploaded payment screenshots and static files
const express = require('express');
const path = require('path');
const router = express.Router();

// Serve uploaded payment screenshots
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve public images (QR codes, etc.)
router.use('/images', express.static(path.join(__dirname, '../../public/images')));

module.exports = router;
