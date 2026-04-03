const express = require('express');
const router = express.Router();
const { processHazardReport } = require('../services/communityService');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route POST /api/community/report
 * @desc  Submit a hazard report from a rider (C-Proof)
 * @access Private (Riders only)
 */
router.post('/report', protect, async (req, res) => {
  try {
    const { zone, hazardType, severity, location } = req.body;
    
    // Validate required fields
    if (!zone || !hazardType || !location) {
      return res.status(400).json({ message: 'Please provide zone, hazardType and location' });
    }

    const result = await processHazardReport({
      userId: req.user.id,
      zone,
      hazardType,
      severity,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Hazard reported successfully to the collective.',
      ...result
    });
  } catch (error) {
    console.error('Hazard Reporting Error:', error);
    res.status(500).json({ message: 'Server error during hazard reporting' });
  }
});

module.exports = router;
