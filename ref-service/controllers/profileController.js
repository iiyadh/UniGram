const bcrypt = require('bcrypt');
const { Custom_EditProfile } = require('../models');

/**
 * Get user profile by ID
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }

        const profile = await Custom_EditProfile('get', null, userId);
        
        if (!profile) {
            return res.status(404).json({ 
                success: false, 
                message: 'Profile not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: profile,
            message: 'Profile retrieved successfully' 
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

/**
 * Update user profile
 */
const editProfile = async (req, res) => {
    const updates = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }

        // Validate input
        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid email format' 
                });
            }
        }

        if (updates.name) {
            if (updates.name.trim().length < 2) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Name must be at least 2 characters' 
                });
            }
        }

        if (updates.password) {
            if (updates.password.trim().length < 6) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Password must be at least 6 characters' 
                });
            }
            // Validate password strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
            if (!passwordRegex.test(updates.password)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Password must contain uppercase, lowercase, and numbers' 
                });
            }
        }

        // Process each update
        for (const [key, value] of Object.entries(updates)) {
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(value, 10);
                await Custom_EditProfile(key, hashedPassword, userId);
            } else if (key === 'name' || key === 'email' || key === 'imgURL') {
                await Custom_EditProfile(key, value, userId);
            }
        }

        res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully' 
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        
        // Handle duplicate email error
        if (err.code === '23505') {
            return res.status(400).json({ 
                success: false,
                message: 'Email already in use' 
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

/**
 * Upload profile image to Cloudinary
 */
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'No file uploaded' 
            });
        }

        const userId = req.userId;

        // Here you would typically upload to Cloudinary
        // For now, we'll assume the multer middleware handles it
        // and saves the URL to the database
        
        const imageUrl = req.file.path; // Cloudinary URL from multer

        await Custom_EditProfile('imgURL', imageUrl, userId);

        res.status(200).json({ 
            success: true,
            data: { imgURL: imageUrl },
            message: 'Image uploaded successfully' 
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to upload image' 
        });
    }
};

module.exports = {
    getProfile,
    editProfile,
    uploadProfileImage,
};