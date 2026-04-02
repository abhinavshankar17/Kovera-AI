const User = require('../models/User');
const Policy = require('../models/Policy');
const Payout = require('../models/Payout');
const TriggerEvent = require('../models/TriggerEvent');

const getDashboardMetrics = async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalPolicies = await User.countDocuments({ activePolicy: { $ne: null } });
    
    // Financial Viability Calculations (Mock up using aggregate if real, simple loops for demo)
    const usersWithPolicy = await User.find({ activePolicy: { $ne: null } }).populate('activePolicy');
    let totalPremiumsCollected = 0;
    usersWithPolicy.forEach(u => {
      totalPremiumsCollected += u.activePolicy.weeklyPremium || 0;
    });

    const payouts = await Payout.find({});
    let totalPayoutsIssued = 0;
    let highRiskFlags = 0;
    let autoPaidCount = 0;

    payouts.forEach(p => {
      totalPayoutsIssued += p.finalPayoutAmount || 0;
      if (p.fraudScoreSnapshot > 60) highRiskFlags++;
      if (p.status === 'Auto-Paid') autoPaidCount++;
    });

    const lossRatio = totalPremiumsCollected > 0 ? (totalPayoutsIssued / totalPremiumsCollected) * 100 : 0;
    const reserveBalance = totalPremiumsCollected - totalPayoutsIssued;

    // Fraud alerts
    const fraudAlerts = await Payout.find({ fraudScoreSnapshot: { $gt: 40 } })
        .populate('user', 'name email primaryZone fraudScore')
        .populate('triggerEvent', 'type zone severity');

    res.json({
      totalWorkers,
      totalPolicies,
      financialViability: {
        totalPremiumsCollected,
        totalPayoutsIssued,
        lossRatio: lossRatio.toFixed(2),
        reserveBalance,
        profitabilityStatus: reserveBalance > 0 ? 'Sustainable' : 'Critical - Adjust Premiums'
      },
      payoutStats: {
        totalClaims: payouts.length,
        autoPaidCount,
        underReviewCount: payouts.filter(p => p.status === 'Under Review').length,
        highRiskFlags
      },
      recentFraudAlerts: fraudAlerts.slice(0, 10)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'worker' })
      .select('-password')
      .populate('activePolicy');
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardMetrics, getRiders };
