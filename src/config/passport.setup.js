const passport = require("passport");
const User = require("../model/fabricant.model");
const local = require("./strategies/local");
const jwt = require("./strategies/jwt.fabricant");
function passportConfig(app) {
    app.use(passport.initialize());


    passport.serializeUser((user, done) => {
        if (!user) return done(null, false);
        return done(null, user.id)
    });
    passport.deserializeUser((id, done) => {

        User.findById(id)
            //.select("email createdOn _id")
            .exec()
            .then((user) => {
                done(null, user);
            })
            .catch(err => {
                done(null, false);
            });
    });
    passport.use("fabricant", local);
    passport.use("jwt-fabricant", jwt);

}

module.exports = passportConfig;