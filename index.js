const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
//routes////////////////////////////////
const spotifyAuth = require("./routes/spotify-auth");
const auth = require("./routes/auth");
const musicRecommendation = require("./routes/music-recommendation");
const saveTrack = require("./routes/save-track");
////////////////////////////////////////
const app = express();
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.73fv4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
app.use(cors());
app
  .use(express.json())
  .use(auth)
  .use(spotifyAuth)
  .use(musicRecommendation)
  .use(saveTrack);

app.use(express.static(__dirname + "/public"));
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Conected"))
  .catch((e) => console.log("Error:", e));

app.get("/", (req, res) => {
  res.send("Sever Express Up");
});

app.listen(port, (err) => {
  throw err;
});
