const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtKey = require("../config/keys").jwt_key;
const utils = require("./utils.model");

const AdminSchema = new Schema({
    email: {type: String, index:true, unique: true, require: true, validate: validator.isEmail, trim: true},
    password: {type: String, require: true, minlength:4},
    createdOn: {type: Date, default: Date.now}
});

AdminSchema.pre("save", utils.preSaveUser);

AdminSchema.methods.isValidPasswd = utils.isValidPasswd ;

AdminSchema.methods.sign = utils.sign ;


//for testing admins
AdminSchema.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        token: "bearer "+ this.sign(),
    }
};

const AdminModel = mongoose.model("User", AdminSchema);

module.exports = AdminModel;