const axios = require('axios');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();


// environment variables
const yelpApiKey = process.env.API_KEY_YELP;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDbName = process.env.MONGO_DB_NAME;

const dbUri = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.xwfkn.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`;


function fetchYelp() {
    let config = {
        headers: { 'Authorization' : `Bearer ${yelpApiKey}`, 'Content-Type': 'application/json' },
        params: {
            "location": "33139",
            "term": "vegan",
            "category": "restaurants,vegan",
            "limit": 50
        }
    }
    
    axios.get('https://api.yelp.com/v3/businesses/search', config)
         .then(response => {
             console.log("yelp");
             var yelpData = response.data.businesses;
             connectToDb(yelpData);
        })
         .catch(err => console.log(err));
}

function connectToDb(yelpData) {
    var  database, collection;
         MongoClient.connect(dbUri, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
            if (error) {
                throw error;
            }
            database = client.db(mongoDbName);
            collection = database.collection('users');
            console.log('Connected to ', mongoDbName);
    
            for (let i = 0; i < yelpData.length; i ++) {
                collection.findOne({ id: yelpData[i].id }, (err, place) => {
                    if (err) {
                        console.log(err);
                    } 
                    if (place) {
                        return
                    }
                    if (!place) {
                        collection.insertOne(yelpData[i])
                                  .then(result => console.log('item inserted:' + result.insertedId))
                                  .catch(err => console.log(err))
                    }
                })
            }
        })
}

fetchYelp()