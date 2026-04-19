const router = require('express').Router();
const { register, login, getMe, validateRegister, validateLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
