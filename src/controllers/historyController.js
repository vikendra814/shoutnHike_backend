const Generation = require('../models/Generation');

const getHistory = async (req, res) => {
  const { page = 1, limit = 10, module } = req.query;
  const filter = { user: req.user._id };
  if (module) filter.module = module;

  const total = await Generation.countDocuments(filter);
  const items = await Generation.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select('-__v');

  res.json({
    success: true,
    data: items,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
};

const getOne = async (req, res) => {
  const gen = await Generation.findOne({ _id: req.params.id, user: req.user._id });
  if (!gen) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: gen });
};

const deleteOne = async (req, res) => {
  const gen = await Generation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!gen) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, message: 'Deleted' });
};

module.exports = { getHistory, getOne, deleteOne };
