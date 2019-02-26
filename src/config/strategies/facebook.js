const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require("../keys");
const callback = require("./oauth.callback");

const fbStrategy = new FacebookStrategy({
    clientID: keys.fb_app_id,
    clientSecret: keys.fb_app_secret,
    callbackURL: 'https://sayara-dz.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email',
        'first_name', 'last_name', 'middle_name', 'gender', 'link']
}, callback);

module.exports = fbStrategy;