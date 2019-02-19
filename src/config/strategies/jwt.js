const User = require("../../model/fabricant.model");
const passport = require("passport");
const Jwtstrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const secretOrKey = require("../constants").jwt_key;

const options = {secretOrKey};
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();

const jwt = new Jwtstrategy(options, verify );

function verify(payload, done) {
    const id = payload.id ;
    User.findById(id)
        .exec()
        .then(user=> done(null, user))
        .catch(err=>done(err, false, {message: {error: "server issue"}}))
}

module.exports = jwt;