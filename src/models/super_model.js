const mongoose = require("mongoose");
const superschema = mongoose.Schema(
  {
    image: String,
    fullname : {
      type :String,
      required : [true,"Fullname required"]
    },
    phone  : {
      type: String,
      validate: {
        validator: (value) => {
          return `${value}`.length === 13 && `${value}`.startsWith("+998");
        },
        message: 'Should be as +998901234567'
      }
    },
    login: String,
    password: String,
    role: {
      type: String,
      default: "Super",
    },
  },
  { strict: false }
);

const super_model = mongoose.model("super", superschema);

module.exports = super_model;
