const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.julqny1.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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

        const coffeCollection = client.db('coffeDB').collection('coffe')

        app.get('/coffe', async (req, res) => {
            const cursor = coffeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // update 

        app.get('/coffe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeCollection.findOne(query);
            res.send(result);
        })


        app.put('/coffe/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true };
            const updatedCoffe= req.body;
            const coffe = {
                $set: {
                    name: updatedCoffe.name,
                    quantity: updatedCoffe.quantity,
                    supplier: updatedCoffe.supplier,
                    taste: updatedCoffe.taste,
                    category: updatedCoffe.category,
                    photo: updatedCoffe.photo,
                    details: updatedCoffe.details,

                }
            }
            const result = await coffeCollection.updateOne(filter, coffe, option);
            res.send(result)
        })


        // delete
        app.delete('/coffe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeCollection.deleteOne(query);
            res.send(result)
        })


        app.post('/coffe', async (req, res) => {
            const newCoffe = req.body;
            console.log(newCoffe);
            const result = await coffeCollection.insertOne(newCoffe);
            res.send(result)
        })









        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffe-store-server is runing')
})




app.listen(port, () => {
    console.log(`this is port :${port}`);
})