const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../config/keys");


function sign() {
    return jsonwebtoken.sign({
        id: this.id,
    }, keys.jwt_key, {
        expiresIn: "1d",
    })
}

function isValidPasswd(password, cb) {
    bcrypt.compare(password, this.password)
        .then(isValid=>{
            cb(null, isValid);
        })
        .catch(err=> cb(err))
}

function preSaveUser(){
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
}

module.exports = {sign, isValidPasswd, preSaveUser};