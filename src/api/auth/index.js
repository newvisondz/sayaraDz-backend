const express = require('express')
const router = express.Router()
const passport = require('passport')
const facebook = require('../../services/passport/strategies/facebook')
const outhCallback = require('../../services/passport/strategies/oauth.callback')
const http = require('../../services/http')

router.get('/facebook', async (req, res, next) => {
  const accessToken = req.query.access_token
  try {
    const profile = await facebook(accessToken)
    outhCallback(accessToken, null, profile, async (err, user) => {
      if (err) return http.internalError(res, err)
      user.token = user.sign()
      await user.findCommands()
      http.ok(res, user)
    }
    )
  } catch (error) {
    http.badRequest(res, error.error.error)
  }
}
)

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', (req, res, next) =>
  passport.authenticate('google', async function (err, user, info) {
    if (err) {
      return res.json(err)
    }
    user.token = user.sign()
    await user.findCommands()

    res.json(user)
  })(req, res, next)
)

module.exports = router
