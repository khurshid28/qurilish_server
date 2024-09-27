const mongoose = require("mongoose");
const room_schema = mongoose.Schema(
  {
    who: String,
    who_phone: String,
    room_number : String,
    price: Number,
    volume: Number,
    image: String,
    etaj: Number,
    home_id : String,
    room_id : String
  },
  { strict: false, timestamps: true }
);
const room_model = mongoose.model("room", room_schema);

module.exports = room_model;

