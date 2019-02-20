const passport = require("passport");
const FabricantUser = require("../model/fabricant.user.model");
const local = require("./strategies/local");
const jwt = require("./strategies/jwt.fabricant");
const facebook = require("./strategies/facebook");

function passportConfig(app) {
    app.use(passport.initialize());

    passport.serializeUser((user, done) => {
        if (!user) return done(null, false);
        return done(null, user.id)
    });

    passport.deserializeUser((id, done) => {

        FabricantUser.findById(id)
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
    passport.use("facebook", facebook);

}

module.exports = passportConfig;