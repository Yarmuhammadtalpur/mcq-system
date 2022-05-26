const mongoose = require("mongoose");

function connectdb() {
  mongoose
    .connect(process.env.mongodb_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => console.log("Cant Connect to DB" + err));
}

module.exports = connectdb;
