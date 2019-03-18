const { authenticated, isFabricantAdmin } = require('../../../services/acl')
const ManufacturerUser = require('./model')
const crud = require('../../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const query = require('querymen').middleware
const { timestamps } = require('../../../services/validation')
const http = require('../../../services/http')

exports.read = [
  isFabricantAdmin,
  authenticated,
  query({ ...timestamps }),
  middleware,
  crud.read
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.create
]

exports.update = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.update
]

exports.updateMe = [
  isFabricantAdmin,
  authenticated,
  middleware,
  (req, res, next) => {
    delete req.body.isAdmin
    req.params.id = req.user.id
    next()
  },
  crud.update
]

exports.deleteOne = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.deleteOne
]

function middleware (req, res, next) {
  const { manufacturer, user } = req
  if (manufacturer != user.manufacturer) {
    return http.notFound(res, {
      error: true,
      msg: 'permission denied'
    })
  }
  if (req.querymen) {
    req.querymen.query.manufacturer = manufacturer
    req.querymen.query.isAdmin = false
  }
  req.body.manufacturer = manufacturer
  req.body.isAdmin = false
  next()
}
