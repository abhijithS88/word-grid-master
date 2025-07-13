const db = require('../db/connectSQL')

const getLeaderboard = async(req,res,next) =>{
  const querySQL = 'select username,level,hints from users order by level desc,hints asc';
  db.query(querySQL,(err,results) =>{
    if (err) {
      res.status(500);
      return next(new Error("Failed to fetch leaderboard: " + err.message));
    }
    res.status(200).json(results);
  })
}

module.exports = {getLeaderboard}