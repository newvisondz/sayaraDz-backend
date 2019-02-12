const LocalStrategy = require("passport-local").Strategy;

function localStrategy(passport) {
    passport.use(new LocalStrategy({
            usernameField: "username",
            passwordfield: "password"
        },
        (username, password, done) => {

            if (username === "akram" && password === "akram")
                return done(null, {username, password, id: 120});

            return done(null, false);
        }))
}

module.exports = localStrategy;