const jwt = require('jsonwebtoken');


const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.userId = payload.userId;
        req.userRole = payload.userRole;
        req.userDepartmentId = payload.userDepartmentId;
        next();
    });
}

const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole,
};