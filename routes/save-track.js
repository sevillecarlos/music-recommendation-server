const router = require("express").Router();
const SavedTracks = require("../models/Track");

router.post("/save-track", async (req, res) => {
  const track = new SavedTracks({
    email: req.body.email,
    tracks: req.body.tracks,
  });

  const userEmail = await SavedTracks.findOne({ email: req.body.email });

  try {
    if (userEmail !== null) {
      userEmail.tracks.push(...req.body.tracks);
      const userTracks = await userEmail.save();
      res.json({
        data: {
          email: userTracks.email,
          tracks: userTracks.tracks,
        },
      });
    } else {
      const savedTrack = await track.save();
      res.json({
        data: {
          email: savedTrack.email,
          tracks: savedTrack.tracks,
        },
      });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/save-tracks", async (req, res) => {
  const userEmail = await SavedTracks.findOne({ email: req.body.email });
  try {
    if (userEmail !== null) {
      res.json({
        data: {
          tracks: userEmail.tracks,
        },
      });
    } else {
      res.json({ data: {} });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});
module.exports = router;
