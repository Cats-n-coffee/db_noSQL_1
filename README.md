The goal of this quick project was to retrieve data from some already existing API, and add all the data to MongoDB.

The fetchYelp function queries the API and return all the JSON. This same function calls the second function in the file to connect to MongoDB.

Once connection to MongoDB is established, a 'for loop' checks if the item already exists in the database(findOne method using the item's id). If it exists we just return and move on to the next item, if it doesn't exist in the database we add it (insertOne method).

The data stored in MongoDB will be used in a geolocation project.