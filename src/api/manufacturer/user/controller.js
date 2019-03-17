const { authenticated, isFabricantAdmin } = require('../../../services/acl')
const ManufacturerUser = require('./model')
const crud = require('../../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const query = require('querymen').middleware
const { timestamps } = require('../../../services/validation')

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
exports.deleteOne = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.deleteOne
]

function middleware (req, res, next) {
  const { manufacturer } = req
  console.log({ manufacturer })
  if (req.querymen) {
    req.querymen.query.manufacturer = manufacturer
    req.querymen.query.isAdmin = false
  }
  req.body.manufacturer = manufacturer
  req.body.isAdmin = false
  next()
}
