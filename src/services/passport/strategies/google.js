const GoogleStrategy = require('@passport-next/passport-google-oauth2').Strategy;
const keys = require("../../../config");
const callback = require("./oauth.callback");

module.exports = new GoogleStrategy({
    clientID: keys.google_app_id,
    clientSecret: keys.google_app_secret,
    callbackURL: "https://sayara-dz.herokuapp.com/auth/google/callback",
}, callback)