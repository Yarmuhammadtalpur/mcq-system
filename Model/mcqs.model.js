const mongoose = require("mongoose");

const mcqsschema = new mongoose.Schema({
  Question: {
    type: String,
    require: true,
  },
  Option1: {
    type: String,
    require: true,
  },
  Option2: {
    type: String,
    require: true,
  },
  Option3: {
    type: String,
    require: true,
  },
  CorrectOption: {
    type: String,
    require: true,
  },
});

const mcqsdb = mongoose.model("Questions", mcqsschema);

module.exports = mcqsdb;
