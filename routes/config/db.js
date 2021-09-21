const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.73fv4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Conected"))
  .catch((e) => console.log("Error:", e));

module.exports = mongoose;
