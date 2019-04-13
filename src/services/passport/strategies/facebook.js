// const FacebookStrategy = require('@passport-next/passport-facebook').Strategy
// const keys = require('../../../config')
// const callback = require('./oauth.callback')

// module.exports = new FacebookStrategy({
//   clientID: keys.fb_app_id,
//   clientSecret: keys.fb_app_secret,
//   callbackURL: 'https://sayara-dz.herokuapp.com/auth/facebook/callback',
//   graphApiVersion: 'v3.2',
//   profileFields: ['id', 'displayName', 'email',
//     'first_name', 'last_name', 'middle_name', 'gender', 'link'
//   ]
// }, callback)
// https://www.facebook.com/dialog/oauth?client_id=320960728554804&redirect_uri=https://sayara-dz.herokuapp.com/auth/facebook/callback&scope=email

const request = require('request-promise')

module.exports = (accessToken) =>
  request({
    uri: 'https://graph.facebook.com/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'id, name, email, picture'
    }
  }).then(({ id, name, email, picture }) => ({
    picture: picture.data.url,
    id,
    name,
    emails: [{ value: email }],
    provider: 'facebook'
  }))
// .catch(console.log)

// https://www.facebook.com/dialog/oauth?client_id=320960728554804&redirect_uri=https://sayara-dz.herokuapp.com/auth/facebook/callback&scope=email
