const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// middleware 

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwxsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const globalPartsCollection = client.db('globalParts').collection('parts')
        const globalReviewsCollection = client.db('globalParts').collection('reviews')


        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = globalPartsCollection.find(query);
            const parts = await cursor.toArray();

            res.send(parts);

        })
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const parts = await globalPartsCollection.findOne(query);
            res.send(parts);
        });


        // review Collection 

        app.get('/reviews', async (req, res) => {
            const email = req.query.email;
            const query = { email: email, }
            const cursor = globalReviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.json(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await globalReviewsCollection.insertOne(review);
            res.json(result)
        });

    }
    finally {

    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running Global Parts Center Server Site')


});

app.listen(port, () => {
    console.log('Listening to port', port)

})


