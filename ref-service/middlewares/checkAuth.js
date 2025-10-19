const axios = require('axios');

const validateAuth = async (req, res, next) => {
  try{
    const res = await axios.get('http://localhost:4000/auth/api/auth/validate',
      { headers: { 'Authorization': req.headers['authorization'] } }
    );
    if(res.data.valid){
      req.userId = res.data.userId;
      next();
    }else{
      return res.sendStatus(401);
    }
  }catch(err){
    return res.sendStatus(err.response?.status);
  }
}


module.exports = {
    validateAuth,
};