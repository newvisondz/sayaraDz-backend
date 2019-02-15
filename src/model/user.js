const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
console.log(validator.isEmail("hfia.difhd"));
const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    born: Date,
    createdOn: {type: Date, default: Date.now}
});


const User = mongoose.model("User", userSchema);

module.exports = User;