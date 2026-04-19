const router = require('express').Router();
const { generate, generateStream } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generate);
router.post('/generate/stream', protect, generateStream);

module.exports = router;
