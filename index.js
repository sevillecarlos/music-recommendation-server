const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const auth = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.73fv4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

app.use(express.json()).use(auth);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Conected"))
  .catch((e) => console.log("Error:", e));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
