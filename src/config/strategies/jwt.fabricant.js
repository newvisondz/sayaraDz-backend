const Jwtstrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const secretOrKey = require("../keys").jwt_key;
const options = {secretOrKey};
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();


module.exports = (Model) => {
    verify = (payload, done) => {
        const id = payload.id;
        Model.findById(id)
            .exec()
            .then(user => {
                done(null, user)
            })
            .catch(err => done(err, false))
    };
    const jwt = new Jwtstrategy(options, verify);
    return jwt;
};