const { isAdmin, authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const Validation = require('../../services/validation')
const crud = require('../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: true })
const validate = new Validation(ManufacturerUser.schema)

exports.read = [
  isAdmin,
  authenticated,
  validate.filter.bind(validate),
  queryAdmin,
  crud.read
]

exports.create = [
  isAdmin,
  isFabricantAdmin,
  authenticated,
  validate.requirePaths.bind(validate),
  bodyAdmin,
  crud.create
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  bodyAdmin,
  crud.deleteOne
]
exports.update = [
  isAdmin,
  authenticated,
  validate.filter.bind(validate),
  bodyAdmin,
  crud.update
]

function bodyAdmin (req, res, next) {
  req.body.isAdmin = true
  next()
}
function queryAdmin (req, res, next) {
  req.query.isAdmin = true
  next()
}
