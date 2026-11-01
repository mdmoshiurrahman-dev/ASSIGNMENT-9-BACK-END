import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";
const app = express();
const port = "5000";
app.listen(port, () => {
  console.log("server is running on ", port);
});
app.get("/", (req, res) => {
  res.send({ status: true });
});

const client = new MongoClient(process.env.MONGO_AUTH_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongodbClient = await connectToMongoDB();
const database =  mongodbClient.db('social-serve');
const eventCollection = await database.collection('events').find({}).toArray();
