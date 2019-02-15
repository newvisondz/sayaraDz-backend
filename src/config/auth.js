const passport = require("passport");
const User = require("../model/user");
const local = require("./Strategies/local-strategy");

function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser((user, done)=>{
        if(!user) return done(null, false) ;
        return done(null, user._id || user.id)
    });
    passport.deserializeUser((userId, done)=>{
        if(!userId) return done(null, false) ;
        User.findOne({_id: userId})
            .then(user=>{
                let u = { username: user.username, id : user.id}
                done(null, u);
            })
            .catch(err => {
                done(null, false) ;
            });
    });
    passport.use(local);

}

module.exports = passportConfig;