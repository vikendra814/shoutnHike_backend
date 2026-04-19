const router = require('express').Router();
const { getHistory, getOne, deleteOne } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHistory);
router.get('/:id', protect, getOne);
router.delete('/:id', protect, deleteOne);

module.exports = router;
