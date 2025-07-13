const jwt = require('jsonwebtoken');

const verifyUser = async (req,res,next) =>{
  const token = req.cookies.token;
  if(!token){
    // console.log("try again");
    res.status(401);
    return next(new Error("No authorization,  No token"));
  }
  try{
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decode;
    next();
  }catch(err){
    res.send(401);
    return next(new Error("error in verifying user"+ err.message));
  }
}

module.exports = verifyUser;