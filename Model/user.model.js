const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const Userdb = mongoose.model("UserList", userSchema);

module.exports = Userdb;
