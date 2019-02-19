const passport = require("passport");
const User = require("../model/fabricant.model");
const local = require("./strategies/local");
const jwt = require("./strategies/jwt-fabricant");
function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser((user, done) => {
        if (!user) return done(null, false);
        return done(null, user.id)
    });
    passport.deserializeUser((id, done) => {

        User.findById(id)
            .select("username email createdOn _id")
            .exec()
            .then((user) => {
               // let {username, id, createdOn, email} = user;
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