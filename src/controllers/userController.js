const User = require('../models/User');

const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

const upgradePlan = async (req, res) => {
  // Mock upgrade — in production this would go through Stripe
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { plan: 'pro', quotaLimit: Number(process.env.PRO_QUOTA) || 100 },
    { new: true }
  ).select('-password');
  res.json({ success: true, data: user, message: 'Upgraded to Pro!' });
};

module.exports = { getProfile, upgradePlan };
