const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sr6rc.mongodb.net/burjAlArab?retryWrites=true&w=majority`;


const port = 5000

const app = express()

app.use(cors());
app.use(bodyParser.json());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingsCollection = client.db("burjAlArab").collection("bookings");

  //Insert data into database
app.post('/addBookings', (req, res)=>{
     const newBooking = req.body;
     bookingsCollection.insertOne(newBooking)
     .then(result =>{
         res.send(result.insertedCount > 0)
     })
     console.log(newBooking);
 })

 //Loading or, Getting data from database and covert them into an array to fetch in client side
 app.get('/bookings',(req,res)=>{
    //  console.log(req.headers.authorization);
    console.log(req.query.email);
     bookingsCollection.find({email: req.query.email})
     .toArray((err, documents)=>{
         res.send(documents)
     })
 })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)