const { isAdmin, authenticated, isFabricantAdmin } = require('../../../services/acl')
const ManufacturerUser = require('../user/model')
const query = require('querymen').middleware
const { timestamps } = require('../../../services/validation')
const crud = require('../../../services/crud')(ManufacturerUser, 'manufacturer_amdin', { isAdmin: true })

exports.read = [
  isAdmin,
  authenticated,
  query({ ...timestamps }),
  middleware,
  crud.read
]

exports.create = [
  isAdmin,
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.create
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  middleware,
  crud.deleteOne
]
exports.update = [
  isAdmin,
  authenticated,
  middleware,
  crud.update
]

function middleware (req, res, next) {
  const { manufacturer } = req
  console.log({ manufacturer })
  if (req.querymen) {
    req.querymen.query.manufacturer = manufacturer
    req.querymen.query.isAdmin = true
  }
  req.body.manufacturer = manufacturer
  req.body.isAdmin = true
  next()
}
