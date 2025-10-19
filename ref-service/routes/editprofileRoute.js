const router = require('express').Router();
const { editProfile } = require('../controllers/profileController');
const { validateAuth } = require('../middlewares/checkAuth');

router.put('/editProfile',validateAuth,editProfile);

module.exports = router;