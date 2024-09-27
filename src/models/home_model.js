const mongoose = require("mongoose");
const home_schema = mongoose.Schema(
  {
    address: String,
    image: String,
    etajCount : Number,
  },
  { strict: false, timestamps: true }
);
const home_model = mongoose.model("home", home_schema);

module.exports = home_model;
