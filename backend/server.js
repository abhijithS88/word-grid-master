const express = require('express');
require('dotenv').config();
const {connect} = require('./db/connectMongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {MongoClient , ServerApiVersion} = require('mongodb');
const errorHandler = require('./middleware/errorMiddleware');

const port = process.env.PORT
const uri = process.env.MONGO_URI

const app = express();
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

connect(client);

app.use('/user' , require('./routes/authRoutes'));
app.use('/level' , require('./routes/levelRoutes'));
app.use('/leaderboard' , require('./routes/leaderboardRoutes'));

app.use(errorHandler);

app.use('/' , (req,res)=>{
  res.send('Welcome to the API');
})

app.listen(port , () => {
  console.log(`server is running on port ${port}`);
})

