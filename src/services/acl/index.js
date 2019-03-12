const passport = require('passport')
const JwtToken = require('../../api/auth/jwt.model')

const checkFabricantAdminAuth = (req, res, next) => passport.authenticate(
  'jwt-manufacturer',
  (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user && user.isAdmin) {
      req.user = user
    }
    next()
  })(req, res, next)

const checkToken = async (req, res, next) => {
  const token = req.headers.authorization
  try {
    newToken = await JwtToken.findOne({
      token
    })
    if (newToken) {
      res.json({
        error: true,
        msg: 'already logout'
      })
    } else next()
  } catch (error) {
    next(error)
  }
}

const checkAuth = (strategy) =>
  (req, res, next) => passport.authenticate(strategy, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) req.user = user
    next()
  })(req, res, next)

exports.generateToken = (req, res, next) => {
  req.user.token = req.user.sign()
  next()
}
exports.isFabricant = [
  checkToken, checkAuth('jwt-manufacturer')
]

exports.isAdmin = [
  checkToken, checkAuth('jwt-admin')
]

exports.isFabricantAdmin = [
  checkToken, checkFabricantAdminAuth
]

exports.isAutomobiliste = [
  checkToken, checkAuth('jwt-automobiliste')
]
exports.checkAuth = checkAuth

exports.authenticated = ({ user }, res, next) => {
  if (user) next()
  else {
    res.json({
      error: true,
      msg: 'permission denied'
    })
  }
}
