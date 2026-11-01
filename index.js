import express from "express";
import "dotenv/config";
const app = express();
const port = "5000";
app.listen(port, () => {
  console.log("server is running on ", port);
});
app.get("/", (req, res) => {
  res.send({ status: true });
});
