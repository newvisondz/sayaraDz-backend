const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../config/keys");


function sign() {
    return "bearer "+ jsonwebtoken.sign({
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

function preSaveUser(next){
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

function getFabQueryObject(query){
    let {email, password, firstName, lastName, address, phone, isAdmin, createdOn} = query;
    const q = {email, password, firstName, lastName, address, phone, isAdmin, createdOn};
    for(let prop in q) if(!q[prop]) delete q[prop];

    return q
}
function getAdminQueryObject(query){
    let {email, password, createdOn} = query;
    const q = {email, password, createdOn};
    for(let prop in q) if(!q[prop]) delete q[prop];

    return q;
}

module.exports = {sign, isValidPasswd, preSaveUser, getAdminQueryObject, getFabQueryObject};