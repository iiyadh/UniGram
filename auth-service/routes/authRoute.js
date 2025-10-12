const router = require('express').Router();
const { login , logout , refresh } = require('../controllers/authController');
const { authenticateToken , validateUID } = require('../middlewares/auth');


router.post('/login',login);
router.post('/refrech',refresh);
router.post('/logout',logout);

router.get('/isValidAuth',authenticateToken,validateUID,(req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    return res.status(200).json(userWithoutPassword);
});

router.get('/', (req, res) => {
    res.send('Auth service is running');
});


module.exports = router;