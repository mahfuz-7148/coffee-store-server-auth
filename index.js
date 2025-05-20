const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

require('dotenv').config()


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeesCollection = client.db('coffeesDb').collection('coffees')
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get('/coffees', async (req, res) => {
            const result = await coffeesCollection.find().toArray()
            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body
            console.log(newCoffee)
            const result = await coffeesCollection.insertOne(newCoffee)
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server ${port}`)
})