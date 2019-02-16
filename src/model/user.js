const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtKey = require("../config/constants").jwt_key;

const userSchema = new Schema({
    email: {type: String, trim: true, validate: validator.isEmail},
    username: {type: String, unique: true, require: true, minlength: 4, trim: true},
    password: {type: String, require: true, minlength:4},
    born: Date,
    createdOn: {type: Date, default: Date.now}
});

userSchema.pre("save", function (next) {
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

userSchema.methods.isValidPasswd = function (password, cb) {
    console.log("isvalid", password, this) ;
    bcrypt.compare(password, this.password)
        .then(isValid=>{
            cb(null, isValid);
        })
        .catch(err=> cb(err))
};

userSchema.methods.sign = function () {
    return jsonwebtoken.sign({
        id: this.id,
    }, jwtKey)
};

userSchema.methods.toJSON = function () {
    return {
        id: this.id,
        username: this.username,
        email: this.email,
        createdOn: this.createdOn,
        token: `JWT ${this.sign()}`,
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;