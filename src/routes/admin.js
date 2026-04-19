const router = require('express').Router();
const { getStats, updateUserPlan } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.patch('/users/:id/plan', updateUserPlan);

module.exports = router;
