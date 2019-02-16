const passport = require("passport");
const User = require("../model/user");
const local = require("./Strategies/local-strategy");

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
                let {username, id, createdOn, email} = user;
                done(null, {username, id, createdOn, email});
            })
            .catch(err => {
                done(null, false);
            });
    });
    passport.use(local);

}


module.exports = passportConfig;