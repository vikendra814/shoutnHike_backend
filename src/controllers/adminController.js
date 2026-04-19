const User = require('../models/User');
const Generation = require('../models/Generation');

const getStats = async (req, res) => {
  const [totalUsers, totalGenerations, userBreakdown] = await Promise.all([
    User.countDocuments(),
    Generation.countDocuments(),
    User.find().select('name email plan usageCount quotaLimit createdAt').lean(),
  ]);

  const moduleStats = await Generation.aggregate([
    { $group: { _id: '$module', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: { totalUsers, totalGenerations, moduleStats, users: userBreakdown },
  });
};

const updateUserPlan = async (req, res) => {
  const { plan } = req.body;
  if (!['free', 'pro'].includes(plan))
    return res.status(400).json({ success: false, message: 'Invalid plan' });

  const quotaLimit = plan === 'pro' ? Number(process.env.PRO_QUOTA) || 100 : Number(process.env.FREE_QUOTA) || 5;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { plan, quotaLimit },
    { new: true }
  ).select('-password');

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

module.exports = { getStats, updateUserPlan };
