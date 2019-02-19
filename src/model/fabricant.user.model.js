const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtKey = require("../config/keys").jwt_key;

const fabricantUserSchema = new Schema({
    email: {type: String, index:true, unique: true, require: true, validate: validator.isEmail, trim: true},
    password: {type: String, require: true, minlength:4},
    firstName: {type: String},
    lastName: {type: String},
    address: {type: String},
    phone: {type: String},
    isAdmin: Boolean,
    createdOn: {type: Date, default: Date.now}
});

fabricantUserSchema.pre("save", function (next) {
    const user = this;
    if(!user.isModified("password")){
        return next()
    }
    bcrypt.hash(this.password, 12)
        .then(hash=>{
            this.password = hash;
            next();
        })
        .catch(err=>{
            next(err);
        })
});

fabricantUserSchema.methods.isValidPasswd = function (password, cb) {
    bcrypt.compare(password, this.password)
        .then(isValid=>{
            cb(null, isValid);
        })
        .catch(err=> cb(err))
};

fabricantUserSchema.methods.sign = function () {
    return jsonwebtoken.sign({
        id: this.id,
    }, jwtKey, {
        expiresIn: "1d",
    })
};

fabricantUserSchema.methods.toJSON = function () {
    return {
        email: this.email,
        id: this.id,
        isAdmin: this.isAdmin || false,
        token: "bearer "+ this.sign(),
    }
};

const FabricantUserModel = mongoose.model("User", fabricantUserSchema);

module.exports = FabricantUserModel;