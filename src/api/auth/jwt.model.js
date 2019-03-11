const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const tokenSchema = new Schema({
   token: {
      type: String,
      required: true,
      unique: true,
      validate: (value) => {
         return validator.isJWT(value.substr(7))
      }
   },
   createdOn: {
      type: Date,
      default: Date.now,
      expires: "99d",
   }
})
const TokenModel = mongoose.model("token", tokenSchema);
module.exports = TokenModel