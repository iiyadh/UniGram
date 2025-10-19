const jwt = require('jsonwebtoken');


const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.userId = payload.userId;
        next();
    });
}

module.exports = {
    authenticateToken,
};