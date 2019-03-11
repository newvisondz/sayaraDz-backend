const FacebookStrategy = require('@passport-next/passport-facebook').Strategy;
const keys = require("../../../config");
const callback = require("./oauth.callback");

module.exports = new FacebookStrategy({
    clientID: keys.fb_app_id,
    clientSecret: keys.fb_app_secret,
    callbackURL: 'https://sayara-dz.herokuapp.com/auth/facebook/callback',
    graphApiVersion: 'v3.2',
    profileFields: ['id', 'displayName', 'email',
        'first_name', 'last_name', 'middle_name', 'gender', 'link'
    ]
}, callback);