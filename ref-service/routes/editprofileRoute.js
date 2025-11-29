const router = require('express').Router();
const { editProfile, getProfile, uploadProfileImage } = require('../controllers/profileController');
const { validateAuth } = require('../middlewares/checkAuth');
const upload = require('../lib/multerConfig'); // Assuming you have multer config for file uploads

// Get user profile
router.get('/', validateAuth, getProfile);

// Update user profile
router.put('/', validateAuth, editProfile);

// Upload profile image
router.post('/upload-image', validateAuth, upload.single('image'), uploadProfileImage);

module.exports = router;