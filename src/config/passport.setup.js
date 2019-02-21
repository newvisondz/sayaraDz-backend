const passport = require("passport");
const FabricantUser = require("../model/fabricant.user.model");
const local = require("./strategies/local");
const jwt = require("./strategies/jwt.fabricant");
const facebook = require("./strategies/facebook");
const google = require("./strategies/google");

function passportConfig(app) {

    app.use(passport.initialize());

    passport.use("fabricant", local);
    passport.use("jwt-fabricant", jwt);
    passport.use("facebook", facebook);
    passport.use("google", google);

}

module.exports = passportConfig;