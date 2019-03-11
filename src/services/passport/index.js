const passport = require("passport");
const FabricantUser = require("../../api/manufacturer-user/model");
const Admin = require("../../api/admin/model");

const local = require("./strategies/local");
const jwt = require("./strategies/jwt.fabricant");
const facebook = require("./strategies/facebook");
const google = require("./strategies/google");

module.exports = (app) => {

    app.use(passport.initialize());

    passport.use("local-fabricant", local(FabricantUser));
    passport.use("local-admin", local(Admin));
    passport.use("jwt-fabricant", jwt(FabricantUser));
    passport.use("jwt-admin", jwt(Admin));
    passport.use("facebook", facebook);
    passport.use("google", google);

}