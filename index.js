const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
    MongoClient,
    ServerApiVersion,
    Collection,
    ObjectId,
} = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// medilwire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzq5bn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
client.connect().catch(console.dir);
const careerCollection = client.db("CareerCode").collection("jobs");
const applicationsCollection = client
    .db("CareerCode")
    .collection("applications");

app.get("/jobs", async (req, res) => {
    const email = req.query.email;
    const query = {};
    if (email) {
        query.hr_email = email;
    }

    const cursor = careerCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
});
// this not applicable
// app.get('/jobsByEmailAddress' , async(req, res)=>{
//     const email = req.query.email;
//     const query = {he_email: email}
//     const result = await careerCollection.find(query).toArray();
//     res.send(result)
// })

app.get("/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await careerCollection.findOne(query);
    res.send(result);
});

app.post("/jobs", async (req, res) => {
    const newJob = req.body;
    const result = await careerCollection.insertOne(newJob);
    res.send(result);
});

// application api

app.get("/applications", async (req, res) => {
    const email = req.query.email;
    const query = {
        application: email,
    };
    const result = await applicationsCollection.find(query).toArray();

    // another collection added
    for (const applicationData of result) {
        const jobId = applicationData.jobId;
        const jobQuery = { _id: new ObjectId(jobId) };
        const job = await careerCollection.findOne(jobQuery);
        applicationData.company = job.company;
        applicationData.title = job.title;
        applicationData.company_logo = job.company_logo;
    }
    res.send(result);
    console.log(result);
});


app.get('/applications/job/:job_id', async(req, res)=>{
const job_id = req.params.job_id;
const query = {jobId : job_id};
const result = await applicationsCollection.find(query).toArray();
res.send(result)
})

app.post("/applications", async (req, res) => {
    const application = req.body;
    const result = await applicationsCollection.insertOne(application);
    res.send(result);
});

app.delete("/applications/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await applicationsCollection.deleteOne(query);
    res.send(result);
});

app.get("/", (req, res) => {
    res.send("career code is cooking");
});
app.listen(port, () => {
    console.log(`career code server is running on port : ${port}`);
});
