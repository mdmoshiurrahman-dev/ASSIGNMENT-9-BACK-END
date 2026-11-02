import express from "express";
import "dotenv/config";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
app.use(cors());
app.use(express.json());
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
const database = mongodbClient.db("social-serve");
const eventCollection = database.collection("events");
const today = new Date().toISOString().split("T")[0];
app.get("/recent-upcoming-events", async (req, res) => {
  const recentUpcomingEvents = await eventCollection
    .find({ event_date: { $gte: today } })
    .sort({ event_date: 1 })
    .limit(6)
    .toArray();
  res.send(recentUpcomingEvents);
});

app.get("/old-gallery-image", async (req, res) => {
  const galleryImages = await eventCollection
    .find({}, { projection: { event_cover_image: 1, event_create_date: 1 } })
    .sort({ event_create_date: -1 })
    .limit(8)
    .toArray();
  res.send(galleryImages);
});

app.post("/create-event", async (req, res) => {
  const data = req.body;
  const result = await eventCollection.insertOne(data);
  res.send(result);
});

app.get("/all-events", async (req, res) => {
  const data = await eventCollection
    .find({ event_date: { $gte: today } })
    .sort({ event_date: 1 })
    .toArray();
  res.send(data);
});

app.get("/gallery-image", async (req, res) => {
  const images = await eventCollection
    .find({}, { projection: { event_cover_image: 1, event_title: 1 } })
    .sort({ event_date: -1 })
    .toArray();
  res.send(images);
});

app.get("/event/:id", async (req, res) => {
  const eventId = req.params.id;
  const query = { _id: new ObjectId(eventId) };
  const data = await eventCollection.findOne(query);
  res.send(data);
});

app.get("/related/:category", async (req, res) => {
  const category = req.params.category;
  const data = await eventCollection
    .find({
      category: category,
      event_date: { $gte: today },
    })
    .sort({ event_date: 1 })
    .limit(4)
    .toArray();
  res.send(data);
});
