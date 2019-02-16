const User = require("../../model/user");
const passport = require("passport");
const Jwtstrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const secretOrKey = require("../constants").jwt_key;

const options = {secretOrKey};
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();

const jwt = new Jwtstrategy(options, verify );

function verify(payload, done) {
    console.log(payload, "payload");
    const id = payload.id ;
    User.findById(id)
        .exec()
        .then(user=> done(null, user))
        .catch(err=>done(err, false ))
}

module.exports = jwt;