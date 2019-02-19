const Fabricant = require("../../model/fabricant.model");
const Jwtstrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const secretOrKey = require("../keys").jwt_key;

const options = {secretOrKey};
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();

const jwtFabricant = new Jwtstrategy(options, verify );

function verify(payload, done) {
    const id = payload.id ;
    Fabricant.findById(id)
        .exec()
        .then(user=> done(null, user))
        .catch(err=>done(err, false, {message: {error: "server issue"}}))
}

module.exports = jwtFabricant;