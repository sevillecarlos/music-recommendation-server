const router = require("express").Router();
const request = require("request");

router.post("/recommendation", (req, res) => {
  request.get(
    {
      url:
        "https://api.spotify.com/v1/recommendations?limit=50&seed_artists=" +
        req.body.seedArtist +
        "&seed_tracks=" +
        req.body.seedTrack,
      headers: {
        Authorization: "Bearer " + req.body.accessToken,
      },

      json: true,
    },
    function (error, response, body) {
      res.send(body);
    }
  );
});
module.exports = router;
