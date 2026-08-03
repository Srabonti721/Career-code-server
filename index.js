const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
 
// medilwire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzq5bn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect().catch(console.dir);
const careerCollection = client.db("CareerCode").collection("jobs")

app.get('/jobs', async(req, res)=>{
  const cursor = careerCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

app.get("/jobs/:id", async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await careerCollection.findOne(query);
  res.send(result)
})

app.get('/', (req,res)=>{
    res.send("career code is cooking")
})
app.listen(port,()=>{
    console.log(`career code server is running on port : ${port}`);
    
})