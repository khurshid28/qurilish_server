const mongoose = require("mongoose");
const userschema = mongoose.Schema({
    fullname :String,
    phone:  String,
    login: String,
    password: String,
    role: {
        type: String,
        default: "User"
    },
    work_status: {
        type: String,
        default: "working"
    },
},{strict:false})


const user_model = mongoose.model("user", userschema);

module.exports = user_model;
