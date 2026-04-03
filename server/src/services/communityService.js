const CommunityReport = require('../models/CommunityReport');
const TriggerEvent = require('../models/TriggerEvent');

const REPORT_WINDOW_MINS = 20; // 20 minute consensus window
const THRESHOLD = 3; // 3+ reports to trigger

/**
 * Validates hazard reports and initiates community-driven triggers.
 * This is the "opinionated" resilience layer of Kovera AI.
 */
const processHazardReport = async (reportData) => {
  // 1. Save the individual report
  const newReport = new CommunityReport({
    reporterId: reportData.userId,
    zone: reportData.zone,
    hazardType: reportData.hazardType,
    severity: reportData.severity || 'Moderate',
    location: reportData.location
  });
  await newReport.save();

  // 2. Check for recent reports in same zone and hazard type
  const startTime = new Date(Date.now() - (REPORT_WINDOW_MINS * 60 * 1000));
  
  const recentReportsCount = await CommunityReport.countDocuments({
    zone: reportData.zone,
    hazardType: reportData.hazardType,
    timestamp: { $gte: startTime }
  });

  // 3. Check if threshold reached
  if (recentReportsCount >= THRESHOLD) {
    // Check if an active TriggerEvent already exists for this community hazard
    const activeEvent = await TriggerEvent.findOne({
      zone: reportData.zone,
      type: `Community ${reportData.hazardType}`,
      endTime: { $exists: false }
    });

    if (!activeEvent) {
      // 4. Create Consensus Trigger for all covered workers in the zone
      const communityTrigger = new TriggerEvent({
        type: `Community ${reportData.hazardType}`,
        zone: reportData.zone,
        severity: reportData.severity || 'Severe',
        metricValue: recentReportsCount, // "Metric" is the consensus count
        startTime: new Date(),
        isSimulated: false, // This is a real community-driven event!
      });

      await communityTrigger.save();
      
      return { 
        triggered: true, 
        message: `Consensus Reached! ${recentReportsCount} riders in ${reportData.zone} reported ${reportData.hazardType}. Resilience Trigger Activated.` 
      };
    }
  }

  return { triggered: false, count: recentReportsCount };
};

module.exports = { processHazardReport };
