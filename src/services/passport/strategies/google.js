const GoogleStrategy = require('@passport-next/passport-google-oauth2').Strategy
const keys = process.env
const callback = require('./oauth.callback')

module.exports = new GoogleStrategy({
  clientID: keys.google_app_id,
  clientSecret: keys.google_app_secret,
  callbackURL: 'https://sayaradz2.herokuapp.com/auth/google/callback'
}, callback)
