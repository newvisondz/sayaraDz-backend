const { isAdmin, authenticated } = require('../../services/acl')
const Admin = require('./model')
const crud = require('../../services/crud')(Admin)
const { ok } = require('../../services/http')
exports.update = [
  isAdmin,
  authenticated,
  (req, res, next) => {
    req.params.id = req.user.id
    next()
  },
  crud.findAndUpdate
]

exports.me = [
  isAdmin,
  authenticated,
  ({ user }, res, next) => {
    ok(res, user)
  }
]
