const router = require('express').Router();
const { getProfile, upgradePlan } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.post('/upgrade', protect, upgradePlan);

module.exports = router;
