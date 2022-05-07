const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middle ware
app.use(cors());
app.use(express.json());

// cluster code 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vouiy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('All-Items').collection('items');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item);
        });

        // get item use query
        app.get('/inventory', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // delete item
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.deleteOne(query);
            res.send(item);
        });
        // post item
        app.post('/inventory', async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });
        // put item
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const quantityUpdate = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: quantityUpdate.quantity,
                }
            };
            const result = await itemsCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);
// errormoy life 
// i hate error but erros love me more

app.get('/', (req, res) => {
    res.send('server running successfully');
});
app.listen(port, () => {
    console.log('server port listening');
});
