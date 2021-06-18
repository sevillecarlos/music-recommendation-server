const mongoose = require("mongoose");

const savedTrackSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  tracks: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("SavedTracks", savedTrackSchema);
