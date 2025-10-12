const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const login = async (req,res) => {
    const { cin, password } = req.body;
    console.log(req.body);
    try{
        const user = await User.findOne({cin});
        if(!user){
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);
        res.cookie('token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).send({ message : 'User logged in' , token: accessToken });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const refresh = (req, res) => {
    const refreshToken = req.cookies.token;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = createAccessToken(user.userId);
        res.json({ token: newAccessToken });
    });
};

const logout = (req ,res) =>{
    if(!req.cookies.token) {
        return res.status(400).json({ message: 'No user is logged in' });
    }
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).send({ message: 'User logged out' });
}

module.exports = {
    login,
    logout,
    refresh
}