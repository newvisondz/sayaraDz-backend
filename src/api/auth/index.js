const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', (req, res, next) =>
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      return res.json(err)
    }
    user.token = user.sign()
    res.json(user)
  })(req, res, next)
)

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', (req, res, next) =>
  passport.authenticate('google', function (err, user, info) {
    if (err) {
      return res.json(err)
    }
    user.token = user.sign()
    res.json(user)
  })(req, res, next)
)

module.exports = router
