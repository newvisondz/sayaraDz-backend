const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
   token: {type: String, required: true, expires: "1d", unique: true}
});

const TokenModel = mongoose.model("token", tokenSchema);

module.exports = TokenModel;