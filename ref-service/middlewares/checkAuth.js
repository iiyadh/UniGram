const axios = require('axios');

const validateAuth = async (req, res, next) => {
  try{
    const res = await axios.get('http://localhost:4000/auth/api/auth/validate',
      { headers: { 'Authorization': req.headers['authorization'] } }
    );
    if(res.data.valid){
      req.userId = res.data.userId;
      req.userRole = res.data.userRole;
      req.userDepartmentId = res.data.userDepartmentId;
      next();
    }else{
      return res.sendStatus(401);
    }
  }catch(err){
    return res.sendStatus(err.response?.status);
  }
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
    validateAuth,
    authorizeRole,
};