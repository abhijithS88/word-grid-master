const db = require('../db/connectSQL');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (email) => {
  return jwt.sign({email},process.env.JWT_SECRET,{
    expiresIn:'30d',
  })
}

const registerUser = async(req,res,next) =>{
  const {username,email,password} = req.body;
  if(!username || !email || !password){
    res.status(400);
    return next(new Error("All fields are required"));
  }
  const checkSQL = `SELECT * FROM users WHERE email = ? OR username = ?`;
  db.query(checkSQL,[email,username], async (err,result)=>{
    if(err)return next(err);
    if(result.length>0){
      res.status(400);
      return next(new Error("Username or Email already exists"));
    }
    let hashedPassword;
    try{
      hashedPassword = await bcrypt.hash(password, 10);
    }
    catch(err){
      res.status(500);
      return next(new Error('Error in hashing password'));
    }
    const insertSQL = 'INSERT INTO users(username,email,password) values(?,?,?)'
    db.query(insertSQL,[username,email,hashedPassword], async (err,result)=>{
      if(err)return next(err);
      const token  = generateToken(email);
      res.cookie('token',token,{
        httpOnly : true,
        sameSite: 'Lax',
        secure: false
      });
      res.status(201).json({"message":"user added successfully!"});
    })
  })
}

const loginUser = async(req,res,next) =>{
  const {email,password} = req.body;
  if(!email || !password){
    res.status(400);
    return next(new Error("All fields are required"));
  }
  const findSQL = `SELECT username,password FROM users WHERE email = ?`;
  db.query(findSQL,[email],async(err,result)=>{
    if(err)return next(err);
    if(result.length==0){
      res.status(400);
      return next(new Error("Email doesn't exists"));
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password,user.password);
    if(isMatch){
      const token  = generateToken(email);
      res.cookie('token',token,{
        httpOnly : true,
        sameSite: 'Lax',
        secure: false
      });
      res.status(200).json({"message":`${user.username} logined successfully!`});
    }
    else{
      res.status(400);
      return next(new Error('Wrong password'));
    }
  })
}

const userDetails = async(req,res,next) => {
  const {email} = req.user;
  const findSQL = 'SELECT * FROM users WHERE email=?'
  db.query(findSQL,[email],async(err,results)=>{
    if(err)return next(err);
    if(results.length===0){
      res.status(404).json({"message":"User not found!"});
    }
    const details = results[0];
    res.status(200).json({
      "username":details.username,
      "email":details.email,
      "level":details.level,
      "hints":details.hints,
    });
  })
}

const deleteUser = async (req,res,next) => {
  const {email} = req.user;
  const deleteSQL = 'DELETE FROM users WHERE email = ?';
  db.query(deleteSQL,[email],async(err,results)=>{
    if(err)return next(err);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
     res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // Set to true in production with HTTPS
    });
    res.status(200).send("user deleted successfully and cookie removed");
  })
}

module.exports = {registerUser,loginUser,userDetails,deleteUser};