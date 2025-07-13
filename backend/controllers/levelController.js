const { getDB } = require('../db/connectMongo');
const SQLdb = require('../db/connectSQL');

const updateHints = async (email) =>{
  const updateSQL = 'Update users set hints = hints + 1 where email = ?'
  SQLdb.query(updateSQL, [email], (err, results) => {
    if (err) {
      console.error("Hint update failed:", err.message);
    }
  })
} 

const giveHints = async (req,res,next) =>{
  const collectedWords = req.body.collectedWords;
  const {email} = req.user;
  const id = parseInt(req.params.id);
  const db = getDB();
  const collection = db.collection('levels-collection'); 
   try{
    const data = await collection.findOne({level:id});
    const wordsList = data.words;
    let hint;
    for(string of wordsList){
      if(!collectedWords.includes(string)){
        hint = string;
        break;
      }
    }
    if(!hint){
      return res.status(200).json({message:'No new words to collect'});
    }
    updateHints(email);
    res.status(201).json({hint});
  }catch(err){
    res.status(401);
    return next(new Error("Hint request failed/Not found"+ err.message));
  }
}

const updateLevel = async (req,res,next) =>{
  const {email} = req.user;
  const updateSQL = 'Update users set level = level + 1 where email = ?'
  SQLdb.query(updateSQL,[email],async(err,results) =>{
    if (err) {
      res.status(500);
      return next(new Error("Failed to update level: " + err.message));
    }
    res.status(200).json({ message: "Level updated successfully" });
  })
}

const getGridData = async (req,res,next) =>{
  const id = req.params.id;
  const db = getDB();
  const collection = db.collection('levels-collection'); 
  const {email} = req.user;
  const querySQL = 'select level from users where email = ?';
  SQLdb.query(querySQL,[email],async (err,results) =>{
    if (err) {
      res.status(500);
      return next(new Error("Error in validating level : " + err.message));
    }
    if(results[0].level==id){
      try{
    const data = await collection.findOne({level:parseInt(id)});
    res.status(200).json({
      "given":data.given,
      "letters":data.letters,
      "size":data.words.length
    })
  }catch(err){
    res.status(401);
    return next(new Error("data request failed/Not found"+ err.message));
  }
    }
    else{
      return res.status(403).json({ message: "Access denied. You are not authorized to access this level." });
    }
  })
}

const validateWord = async (req,res,next) =>{
  const id = parseInt(req.params.id);
  const word = req.body.word.toLowerCase();
  if (!word) {
    return res.status(400).json({ message: "Word is required" });
  }
  const db = getDB();
  const collection = db.collection('levels-collection');
  try{
    const data = await collection.findOne({level:id});
    const wordsList = data.words;
    // console.log(wordsList);
    if (!wordsList.includes(word)) {
      return res.status(200).json({ message: "Word is not in the list" });
    }
    const position = searchWordInGrid(data.grid, word);
    res.status(200).json({ 
      found: true,
      ...position 
    });
  }catch(err){
    res.status(401);
    return next(new Error("validating word request failed/Not found"+ err.message));
  }
}

function searchWordInGrid(grid, word) {
  const rows = grid.length;
  const cols = grid[0].length;
  const wordLen = word.length;

  // Horizontal (right)
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y <= cols - wordLen; y++) {
      let match = true;
      for (let k = 0; k < wordLen; k++) {
        if (grid[x][y + k] !== word[k]) {
          match = false;
          break;
        }
      }
      if(match){
        if(y+wordLen<cols){
          if(grid[x][y+wordLen]==='.'){
            return { x, y, dir: "horizontal" };
          }
        }
        else{
          return { x, y, dir: "horizontal" };
        }
      }
    }
  }

  // Vertical (down)
  for (let x = 0; x <= rows - wordLen; x++) {
    for (let y = 0; y < cols; y++) {
      let match = true;
      for (let k = 0; k < wordLen; k++) {
        if (grid[x + k][y] !== word[k]) {
          match = false;
          break;
        }
      }
      if(match){
        if(x+wordLen<rows){
          if(grid[x+wordLen][y]==='.'){
            return { x, y, dir: "vertical" };
          }
        }
        else{
          return { x, y, dir: "vertical" };
        }
      }
    }
  }

  return null;
}


module.exports = {getGridData,validateWord,updateLevel,giveHints}