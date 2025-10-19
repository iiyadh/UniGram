const router = require('express').Router();
const { login , logout , refresh } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');


router.post('/login',login);
router.post('/refrech',refresh);
router.post('/logout',logout);

router.get('/validate',authenticateToken,(req, res) => {
    return res.status(200).json({ valid: true, userId: req.userId });
});

router.get('/', (req, res) => {
    res.send('Auth service is running');
});


module.exports = router;