const router = require('express').Router();
const { editProfile } = require('../controllers/profileController');
const { validateAuth } = require('../middlewares/checkAuth');

router.put('/',validateAuth,editProfile);

module.exports = router;