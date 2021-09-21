const router = require("express").Router();
const SavedTracks = require("../models/Track");

router.post("/save-track", async (req, res) => {
  const { userId, track } = req.body;

  try {
    const user = await SavedTracks.findOne({ userId: userId });
    if (user !== null) {
      user.tracks.push(track);
      await user.save();
      res.json({
        data: {
          added: true,
        },
      });
    } else {
      const saveTrack = new SavedTracks({
        userId: userId,
        tracks: [track],
      });
      await saveTrack.save();
      res.json({
        data: {
          added: true,
        },
      });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/saved-tracks", async (req, res) => {
  const { id } = req.body;
  try {
    const [user] = await SavedTracks.find({ userId: id });

    const { tracks } = user;
    if (user) {
      res.json({
        data: {
          tracks: tracks,
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
  const { userId, trackId } = req.body;

  try {
    const user = await SavedTracks.findOne({ userId: userId });
    const { tracks } = user;
    const trackIndex = tracks.findIndex((track) => track.id === trackId);
    if (trackIndex !== -1) {
      tracks.splice(trackIndex, 1);
      user.save();
      res.json({
        data: { removedTrackId: trackIndex },
      });
    } else {
      throw new Error("Track not found");
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});
module.exports = router;
