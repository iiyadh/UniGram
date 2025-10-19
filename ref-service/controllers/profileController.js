const bcrypt = require('bcrypt');
const { Custom_EditProfile } = require('../models');

const editProfile = async (req, res) => {
    const updates = req.body;
    try {
        for (const [key, value] of Object.entries(updates)) {
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(value, 10);
                await Custom_EditProfile( key, hashedPassword , req.userId);
            } else {
                await Custom_EditProfile(key ,value, req.userId);
            }
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    editProfile,
};