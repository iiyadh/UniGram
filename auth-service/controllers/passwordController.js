const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendEmail } = require('../lib/emailSender');


const forgotPassword = async (req,res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000;
        await User.updateResetToken(email, resetToken, resetTokenExpiration);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Reset - Unigram',
            text: `You requested a password reset. Click here to reset your password: ${resetLink}`,
            html: `
            <div style="
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #FFFFFF;
            border-radius: 12px;
            border-top: 5px solid #6B46C1;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            ">
            <div style="text-align: center;">
            <img src="https://i.postimg.cc/XJGBgHfM/Logo-removebg-preview.png" alt="Unigram Logo" style="width:80%;margin:0 auto;display:block;"/>
            </div>
            <h1 style="
            color: #1A365D;
            text-align: center;
            margin-bottom: 25px;
            font-size: 28px;
            ">
            Password Reset
            </h1>

            <p style="
            color: #2D3748;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            text-align: center;
            ">
            A password reset was requested for your Unigram account.
            </p>

            <p style="
            color: #2D3748;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            text-align: center;
            ">
            To set a new password, please click the button below:
            </p>

            <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="
            background-color: #6B46C1;
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            transition: background-color 0.3s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
            Reset Password
            </a>
            </div>

            <p style="
            color: #4A5568;
            font-size: 14px;
            line-height: 1.5;
            margin-top: 25px;
            border-top: 1px solid #E2E8F0;
            padding-top: 20px;
            text-align: center;
            ">
            If you didn't request this password reset, please ignore this email or 
            <a href="mailto:support@unigram.com" style="color: #6B46C1; text-decoration: none;">contact our support team</a>.
            </p>
            </div>
            `,
        };
        await sendEmail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const resetPassword = async (req,res) =>{
    const token = req.params.token;
    const { newPassword } = req.body;
    try {
        // Check if token exists and hasn't expired
        const userQuery = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
            [token, new Date()]
        );
        const user = userQuery.rows[0];
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(token, hashedPassword);
        res.status(200).json({ message: 'Password has been reset successfully' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    forgotPassword,
    resetPassword
}