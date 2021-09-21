const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");
const spotifyAuth = require("./routes/spotify-auth");
const auth = require("./routes/auth");
const musicRecommendation = require("./routes/music-recommendation");
const saveTrack = require("./routes/save-track");
////////////////////////////////////////
const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app
  .use(express.json())
  .use(auth)
  .use(spotifyAuth)
  .use(musicRecommendation)
  .use(saveTrack);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send("Server Express Up");
});

app.listen(port, (err) => {
  console.log(`App running in localhost:${port}`);
  if (err) throw err;
});
