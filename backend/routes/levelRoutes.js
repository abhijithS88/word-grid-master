const express = require('express');
const Router = express.Router()
const verifyUser = require('../middleware/authMiddleware');
const { getGridData, validateWord, updateLevel, giveHints } = require('../controllers/levelController');

Router.get('/:id',verifyUser,getGridData);
Router.post('/:id/check',verifyUser,validateWord);
Router.put('/updateLevel',verifyUser,updateLevel);
Router.post('/:id/giveHints',verifyUser,giveHints);

module.exports = Router;