const request = require('request-promise')

module.exports = (accessToken) =>
  request(
    {
      uri: 'https://graph.facebook.com/me',
      json: true,
      qs: {
        access_token: accessToken,
        fields: 'id, name, email, picture'
      }
    }
  ).then(
    ({ id, name, email, picture }) => (
      {
        picture: picture.data.url,
        id,
        name,
        emails: [{ value: email }],
        provider: 'facebook'
      }
    )
  )
