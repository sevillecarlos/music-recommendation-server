const router = require("express").Router();
const request = require("request");
const querystring = require("querystring");
const randomstring = require("randomstring");

router.get("/login-spotify", function (req, res) {
  console.log("object");
  const state = randomstring.generate({
    length: 16,
    charset: "alphabetic",
  });
  const scope =
    "user-read-private user-read-email user-read-playback-state user-library-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state,
      })
  );
});
router.get("/callback", function (req, res) {
  console.log("me ll");
  const code = req.query.code || null;
  const state = req.query.state || null;
  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    //get the token spotify
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
    //add token to the login user
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        res.redirect(
          "http://localhost:3000/home#" +
            querystring.stringify({
              access_token: access_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

module.exports = router;
