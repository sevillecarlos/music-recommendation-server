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
          tracks: userTracks.tracks[userTracks.tracks.length - 1],
        },
      });
    } else {
      const savedTrack = await track.save();
      res.json({
        data: {
          tracks: savedTrack.tracks[savedTrack.tracks.length - 1],
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

router.delete("/remove-save-track", async (req, res) => {
  const userEmail = await SavedTracks.findOne({ email: req.body.email });
  const trackIndex = userEmail.tracks.findIndex(
    (track) => track.id === req.body.trackId
  );

  try {
    if (trackIndex !== -1) {
      userEmail.tracks.splice(trackIndex, 1);
      userEmail.save();
      res.json({
        data: userEmail.tracks,
      });
    } else {
      throw new Error('Track not found')
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});
module.exports = router;
