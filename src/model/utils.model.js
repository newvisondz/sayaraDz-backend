const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../config/keys");

const USER_TYPE = {
    ADMIN: "ADMIN",
    AUTOMOBILISTE: "AUTOMOBILISTE",
    FABRICANT: "FABRICANT"
};

function sign() {
    console.log(this.type, " >>>>")
    return "bearer "+ jsonwebtoken.sign({
        id: this.id,
        type: this.type
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

module.exports = {USER_TYPE, sign, isValidPasswd, preSaveUser, getAdminQueryObject, getFabQueryObject};