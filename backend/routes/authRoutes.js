const express = require('express');
const Router = express.Router()
const {registerUser,loginUser,userDetails, deleteUser} = require('../controllers/authController');
const verifyUser = require('../middleware/authMiddleware');

Router.post('/register' , registerUser);
Router.post('/login', loginUser);
Router.get('/profile',verifyUser,userDetails);
Router.delete('/',verifyUser,deleteUser);

module.exports = Router;