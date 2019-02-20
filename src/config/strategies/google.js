const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require("../keys");
const google = new GoogleStrategy({
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        clientID: keys.google_app_id,
        clientSecret: keys.google_app_secret,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
        done(profile)
    }
);

module.exports = google;