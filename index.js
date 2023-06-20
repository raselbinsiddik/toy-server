const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.fy2r3q4.mongodb.net/?retryWrites=true&w=majority`;


const dbConnect = async () => {
    try {
        client.connect();
        console.log("Database Connected Successfully✅");

    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnect()

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



        const toyCollection = client.db('toyMarket').collection('toyCategory');

        const addToysCollection = client.db('toyDB').collection('toys');


        app.get('/toyCategory', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        
        app.get('/toyCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        });

        app.get('/addToys', async (req, res) => {
            const search = req.query.search;
            console.log(search);

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }

            let result;
            if (search) {
                const nameQuery = { name: { $regex: search, $options: 'i' } };
                result = await addToysCollection.find({ $and: [query, nameQuery] }).toArray();
            } else {
                result = await addToysCollection.find(query).toArray();
            }

            res.send(result);
        });


        // app.get('/addToys', async (req, res) => {
        //     const search = req.query.search;
        //     console.log(search);
        //     const name = { name: { $regex: search, $options: 'i' } };

        //     let query = {};
        //     if (req.query?.email) {
        //         query = { email: req.query.email };
        //     }
        //     const result = await addToysCollection.find(query, name).toArray();
        //     res.send(result);
        // });


        app.get('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToysCollection.findOne(query);
            res.send(result);
        });


        app.post('/addToys', async (req, res) => {
            const newToys = req.body;
            console.log(newToys);
            const result = await addToysCollection.insertOne(newToys);
            res.send(result);
        });

        app.put('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateToys = req.body;
            console.log(updateToys);
            const options = { upsert: true };
            const toy = {
                $set: {
                    name: updateToys.name,
                    quantity: updateToys.quantity,
                    price: updateToys.price,
                    description: updateToys.description,
                    category: updateToys.category,
                    photo: updateToys.photo,
                    rating: updateToys.rating
                }
            };
            const result = await addToysCollection.updateOne(filter, toy, options);
            // const result = await addToysCollection.findOneAndUpdate({ _id: new ObjectId(id) }, toy, { returnDocument: "after" });
            console.log('result', result);
            res.send(result);
        });

        app.delete('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToysCollection.deleteOne(query);
            res.send(result);

        });

app.get('/', (req, res) => {
            res.send('toy is runninig');
        })

app.listen(port, () => {
    console.log('toy is running');
})