const JwtToken = require('../../api/auth/jwt.model')
const { checkAuth } = require('../acl')
var admin = require('firebase-admin')

var serviceAccount = process.env.FCM

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
})

exports.login = (...strategies) => [
  strategies.map(
    s => checkAuth(s, 'invalid credentials')
  ),
  (req, res, next) => {
    if (req.user) next()
    else {
      res.status(404).json({
        error: 1,
        msg: 'invalid credentials'
      })
    }
  },
  generateToken,
  (req, res) => {
    res.json(req.user)
  }
]

const generateToken = (req, res, next) => {
  req.user.token = req.user.sign()
  next()
}

exports.logout = async (req, res) => {
  let token = req.headers.authorization
  if (!token) {
    return res.status(400).json({
      error: true,
      msg: 'token validation failed: token is required.'
    })
  }
  token = new JwtToken({
    token
  })
  try {
    await token.save()
    res.json({
      logout: true
    })
  } catch (error) {
    let logout
    if (error.code == 11000) {
      logout = true
    }
    res.json({
      logout,
      msg: logout ? undefined : error
    })
  }
}

exports.verifyIdToken = (idToken) => admin.auth().verifyIdToken(idToken)
