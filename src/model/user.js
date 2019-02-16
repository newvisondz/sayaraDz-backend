const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");

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

const User = mongoose.model("User", userSchema);

module.exports = User;