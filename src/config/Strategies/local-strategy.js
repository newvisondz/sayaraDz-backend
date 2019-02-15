const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy({
        usernameField: "username",
        passwordfield: "password"
    },
    (username, password, done) => {
        if (username === "akram" && password === "akram")
            return done(null, {username, password, id: 120});
        return done(null, false);
    });
module.exports =  local;