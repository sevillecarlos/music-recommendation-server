const router = require("express").Router();
const request = require("request");

const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi();
const randomNumber = require("../helpers/randomNumber");
const removeParathensisText = require("../helpers/removeParathensisText");

router.post("/recommendation", async (req, res) => {
  const { accessToken } = req.body;

  try {
    spotifyApi.setAccessToken(accessToken);

    const {
      body: { items },
    } = await spotifyApi.getMySavedTracks();

    if (items.length === 0)
      return res.json({ empty_tracks: "You may have at least 1 save track" });

    const {
      track: { artists, id: trackId },
    } = items[randomNumber(items.length, 0)];
    const [principalArtist] = artists;

    if (artists && trackId) {
      request.get(
        {
          url: `https://api.spotify.com/v1/recommendations?limit=50&seed_artists=${principalArtist.id}&seed_tracks=${trackId}`,
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          json: true,
        },
        (error, response, body) => {
          const { tracks } = body;

          const recommendationTracks = tracks
            ?.filter((v) => v.preview_url)
            .slice(0, 20)
            .map((v) => {
              return {
                albumCover: v.album.images[0].url,
                album: removeParathensisText(v.album.name),
                artists: v.artists.map((v) => v.name).join(" x "),
                track: removeParathensisText(v.name),
                demoUrl: v.preview_url,
                id: v.id,
                url: v.external_urls.spotify,
              };
            });
          res.send(recommendationTracks);
        }
      );
    }
  } catch (error) {
    if (error) {
      console.log(error);
      res.json({
        refreshToken: true,
      });
    }
  }
});
module.exports = router;
