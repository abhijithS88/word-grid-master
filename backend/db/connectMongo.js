let db;

const connect = async (client) => {
    try{
      await client.connect();
      db = client.db('levels-database');
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB");
    }
    catch(err){
      throw new Error("monogdb connection failed :" + err.message);
    }
}

const getDB = () => db;

module.exports = {connect,getDB};