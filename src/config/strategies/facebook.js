const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require("../keys");


const fbStrategy = new FacebookStrategy({
    clientID: keys.fb_app_id,
    clientSecret: keys.fb_app_secret,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
}, (accessToken, refreshToken, profile, done) => done(null, profile));

module.exports = fbStrategy;