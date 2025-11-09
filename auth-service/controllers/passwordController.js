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
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
            body {
                font-family: 'Chakra Petch', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f9fafc;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #FFFFFF;
                border-radius: 12px;
                border-top: 5px solid #0514ebd7;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #1A365D;
                font-size: 28px;
                margin-bottom: 25px;
                font-weight: 600;
            }
            p {
                color: #2D3748;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            a.button {
                background-color: #0514ebd7;
                color: white;
                padding: 14px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                display: inline-block;
                transition: background-color 0.3s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            a.button:hover {
                background-color: #0210b5;
            }
            .footer {
                color: #4A5568;
                font-size: 14px;
                line-height: 1.5;
                margin-top: 25px;
                border-top: 1px solid #E2E8F0;
                padding-top: 20px;
            }
            .footer a {
                color: #0514ebd7;
                text-decoration: none;
            }
            img.logo {
                width: 80%;
                margin: 0 auto 20px;
                display: block;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <img src="https://i.postimg.cc/jS2YHCRf/Logo-Light.png" alt="Unigram Logo" class="logo" />
            <h1>Password Reset</h1>
            <p>A password reset was requested for your Unigram account.</p>
            <p>To set a new password, please click the button below:</p>
            <div style="margin: 35px 0;">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <div class="footer">
                If you didn't request this password reset, please ignore this email or 
                <a href="mailto:support@unigram.com">contact our support team</a>.
            </div>
            </div>
        </body>
        </html>
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