const mongoose = require("mongoose");
const Categoryschema = mongoose.Schema(
  {
    name: String,
    image: String,
  },
  { strict: false, timestamps: true }
);
const category_model = mongoose.model("category", Categoryschema);

module.exports = category_model;
