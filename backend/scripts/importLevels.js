require('dotenv').config({ path: __dirname + '/../.env' });
const {connect} = require('../db/connectMongo');
const path = require('path');
const fs = require('fs');
const {MongoClient , ServerApiVersion} = require('mongodb');
const uri = process.env.MONGO_URI

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);


const importfiles = async () => {
  let database,collection;
   try{
    await connect(client);
    database = client.db('levels-database');
    collection = database.collection('levels-collection');
   }
   catch(err){
     throw new Error("Connecting to collection failed" + err.message);
   }

   // reading all json files and storing them in levelsData
   const levelsDir = path.join(__dirname, '../levels');  
   const levelFiles = fs.readdirSync(levelsDir);  // Reading all files
   const levelsData = [];
   for (const file of levelFiles) {
    const filePath = path.join(levelsDir, file); // path to the exact file
    const doc = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Read the file → convert JSON string to JS object
    levelsData.push(doc);
  }

  // insert all files once 
  try{
    await collection.insertMany(levelsData);
  }
  catch(err){
    throw new Error("inserting failed" + err.message);
  }
  finally {
    await client.close();
  }
}

importfiles();
