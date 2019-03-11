const passport = require("passport");
const ManufacturerUser = require("../../api/manufacturer-user/model");
const Admin = require("../../api/admin/model");

const local = require("./strategies/local");
const jwt = require("./strategies/jwt.fabricant");
const facebook = require("./strategies/facebook");
const google = require("./strategies/google");

module.exports = (app) => {

    app.use(passport.initialize());

    passport.use("local-manufacturer", local(ManufacturerUser));
    passport.use("local-admin", local(Admin));
    passport.use("jwt-manufacturer", jwt(ManufacturerUser));
    passport.use("jwt-admin", jwt(Admin));
    passport.use("facebook", facebook);
    passport.use("google", google);

}