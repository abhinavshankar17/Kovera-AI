const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zone: { type: String, required: true }, // e.g., T. Nagar
  hazardType: { 
    type: String, 
    required: true, 
    enum: ['Waterlogging', 'Extreme Heat', 'Traffic Gridlock', 'Road Closure', 'Accident'] 
  },
  severity: { type: String, enum: ['Moderate', 'Severe', 'Critical'], default: 'Moderate' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for geo-spatial queries if needed later, and for TTL (reports expire after 1 hour)
communityReportSchema.index({ timestamp: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('CommunityReport', communityReportSchema);
