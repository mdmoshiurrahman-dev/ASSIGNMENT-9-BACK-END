import express from "express";
import "dotenv/config";
import cors from "cors";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT
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
const eventParticipantsCollection = database.collection("event-join-users");
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
//! MIDDLEWARE-----------
const apiVerify = async (req, res, next) => {
  const jwt = req.headers.authorization;
  if (!jwt) {
    return res.send({ massage: "unauthorized" });
  }
  const token = jwt.split(" ")[1];
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_API_URL}/api/auth/jwks`),
  );
  const { payload } = await jwtVerify(token, JWKS);
  if (!payload) {
    return res.send({ massage: "token validation failed" });
  }
  next();
};

app.get("/old-gallery-image", async (req, res) => {
  const galleryImages = await eventCollection
    .find({}, { projection: { event_cover_image: 1, event_create_date: 1 } })
    .sort({ event_create_date: -1 })
    .limit(8)
    .toArray();
  res.send(galleryImages);
});

app.post("/create-event", apiVerify, async (req, res) => {
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
    .limit(5)
    .toArray();
  res.send(data);
});

app.post("/join-event", async (req, res) => {
  const joinedEventData = req.body;
  const result = await eventParticipantsCollection.updateOne(
    {
      participant_email: joinedEventData.participant_email,
    },
    {
      $addToSet: {
        events: joinedEventData.event_id,
      },
    },
    {
      upsert: true,
    },
  );

  if (result.matchedCount > 0 && result.modifiedCount === 0) {
    await eventParticipantsCollection.updateOne(
      {
        participant_email: joinedEventData.participant_email,
      },
      {
        $pull: {
          events: joinedEventData.event_id,
        },
      },
    );

    return res.send({
      status: false,
    });
  }

  return res.send({
    status: true,
  });
});

app.get("/get-join-event/:email", apiVerify, async (req, res) => {
  const userEmail = req.params.email;
  const userData = await eventParticipantsCollection.findOne({
    participant_email: userEmail,
  });
  if (!userData) {
    return res.send({});
  }
  res.send(userData);
});

app.get("/get-created-events/:email", apiVerify, async (req, res) => {
  const email = req.params.email;
  const data = await eventCollection.find({ creator_email: email }).toArray();
  res.send(data);
});

app.get("/delete/:id", apiVerify, async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const result = await eventCollection.deleteOne(query);
  res.send(result);
});
app.post("/update", apiVerify, async (req, res) => {
  const updateData = req.body;
  const id = { _id: new ObjectId(updateData._id) };

  const result = await eventCollection.updateOne(id, {
    $set: {
      event_title: updateData.event_title,
      category: updateData.category,
      location: updateData.location,
      event_date: updateData.event_date,
      time: updateData.time,
      event_cover_image: updateData.event_cover_image,
      event_description: updateData.event_description,
    },
  });
  res.send(result);
});

app.get("/get-joined-event/:email", apiVerify, async (req, res) => {
  const email = req.params.email;
  const eventsData = await eventParticipantsCollection.findOne(
    { participant_email: email },
    { projection: { events: 1, _id: 0 } },
  );

  if (!eventsData) {
    return res.send({ status: false });
  }

  const joinedEvent = await eventCollection
    .find({
      _id: {
        $in: eventsData.events.map((id) => new ObjectId(id)),
      },
    })
    .toArray();
  res.send(joinedEvent);
});

app.delete("/delete-joined-event/:email/:id", apiVerify, async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  const result = await eventParticipantsCollection.updateOne(
    { participant_email: email },
    {
      $pull: {
        events: id,
      },
    },
  );
  res.send(result);
});
