const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');
const Router = express.Router();

Router.get('/',getLeaderboard);

module.exports = Router;