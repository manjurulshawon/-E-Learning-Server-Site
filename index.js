const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1mk1byt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try {
    await client.connect();
    const database = client.db('eLearning');
    const coursesCollection = database.collection('courses');
    const eventsCollection = database.collection('events');
    const usersCollection = database.collection('users');
    console.log("Connect to DB");
    app.get('/courses',async (req, res) => {
      const cursor = coursesCollection.find();
          const result = await cursor.toArray();
          res.json(result);
    })
    app.post('/courses', async(req, res) => {
      const courses = req.body;
      const result = await coursesCollection.insertOne(courses);
      res.json(result)
    })

     //   single data get 
     app.get('/courses/:id', async (req, res) => {
      const id= req.params.id;
      const query ={_id: new ObjectId(id)};
      console.log('get id')
      const result = await coursesCollection.findOne(query);
      res.json(result);
    })

    app.put('/courses/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = {_id: new ObjectId(id)}
      // const options = { upsert: true };
      const updateDoc = {
         $set:updateData
      };
      const result = await coursesCollection.updateOne(filter, updateDoc);
      res.json(result);
    });


    // Events

    app.get('/events',async (req, res) => {
      const cursor = eventsCollection.find();
          const result = await cursor.toArray();
          res.json(result);
    })
    app.get('/events/:id', async (req, res) => {
      const id= req.params.id;
      const query ={_id: new ObjectId(id)};
      console.log('get id')
      const result = await eventsCollection.findOne(query);
      res.json(result);
    })
    app.post('/events', async(req, res) => {
      const events = req.body;
      const result = await eventsCollection.insertOne(events);
      res.json(result)
    })
    app.post('/users', async (req, res) => {
      let user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
  });

  app.put('/users', async (req, res) => {
      let user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      console.log("ok");
      res.json(result);
  });


  } finally  {
    
  }
 
}


run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})