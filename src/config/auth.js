const passport = require("passport");
const LocalStrategy = require("passport-local");

function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser((user, done)=>{
        if(!user) return done(null, false) ;
        return done(null, user)
    });
    passport.deserializeUser((userId, done)=>{
        console.log(userId);
        if(!userId) return done(null, false) ;
        return done(null, {username: "akram", id: userId})
    });

    require("./Strategies/local-strategy")(passport)

}

module.exports = passportConfig;