const mongoose = require("mongoose");
const item_schema = mongoose.Schema(
  {
    product_id: String,
    user_id: String,
    count: Number,
    price : Number,
    type: String,
    from: String,
  },
  { strict: false, timestamps: true }
);
const item_model = mongoose.model("item", item_schema);

module.exports = item_model;
