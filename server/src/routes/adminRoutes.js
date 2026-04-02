const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getRiders } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/metrics', protect, adminOnly, getDashboardMetrics);
router.get('/riders', protect, adminOnly, getRiders);

module.exports = router;
