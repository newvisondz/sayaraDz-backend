const passport = require("passport");
const User = require("../model/user");
const local = require("./strategies/local");
const jwt = require("./strategies/jwt");
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
                done(null, false, {message: {error: "server issue"}});
            });
    });
    passport.use(local);
    passport.use(jwt);

}



module.exports = passportConfig;