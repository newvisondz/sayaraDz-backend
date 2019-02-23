const GoogleStrategy = require('@passport-next/passport-google-oauth2').Strategy;
const keys = require("../keys");
const callback = require("./oauth.callback");

const google = new GoogleStrategy({
        clientID: keys.google_app_id,
        clientSecret: keys.google_app_secret,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },callback);


module.exports = google;